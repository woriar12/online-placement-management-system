package com.placement.management.service.impl;

import com.placement.management.dto.admin.*;
import com.placement.management.entity.*;
import com.placement.management.entity.enums.*;
import com.placement.management.exception.ResourceNotFoundException;
import com.placement.management.repository.*;
import com.placement.management.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(
            UserRepository userRepository,
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository driveRepository,
            ApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDTO getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalCompanies = companyRepository.count();
        long totalDrives = driveRepository.count();
        long totalApplications = applicationRepository.count();
        long totalSelected = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long totalRejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long totalPending = applicationRepository.countByStatus(ApplicationStatus.APPLIED);

        long eligibleStudents = studentRepository.countByIsEligibleTrue();
        double placementPercentage = eligibleStudents > 0
                ? ((double) totalSelected / eligibleStudents) * 100.0
                : 0.0;

        List<DriveAdminDTO> recentDrives = driveRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(this::mapToDriveDTO).collect(Collectors.toList());

        List<ApplicationAdminDTO> recentApplications = applicationRepository.findTop5ByOrderByAppliedAtDesc()
                .stream().map(this::mapToApplicationDTO).collect(Collectors.toList());

        List<ApplicationAdminDTO> recentSelections = applicationRepository.findTop5ByStatusOrderByAppliedAtDesc(ApplicationStatus.SELECTED)
                .stream().map(this::mapToApplicationDTO).collect(Collectors.toList());

        List<DriveAdminDTO> upcomingDrives = driveRepository.findTop5ByStatusOrderByDriveDateAsc(DriveStatus.UPCOMING)
                .stream().map(this::mapToDriveDTO).collect(Collectors.toList());

        return AdminDashboardStatsDTO.builder()
                .totalStudents(totalStudents)
                .totalCompanies(totalCompanies)
                .totalPlacementDrives(totalDrives)
                .totalApplications(totalApplications)
                .totalSelectedStudents(totalSelected)
                .totalRejectedStudents(totalRejected)
                .totalPendingApplications(totalPending)
                .placementPercentage(Math.round(placementPercentage * 100.0) / 100.0)
                .recentDrives(recentDrives)
                .recentApplications(recentApplications)
                .recentSelections(recentSelections)
                .upcomingDrives(upcomingDrives)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StudentAdminDTO> getAllStudents(String query, String branch, Pageable pageable) {
        return studentRepository.searchStudents(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                (branch != null && !branch.trim().isEmpty()) ? branch.trim() : null,
                pageable
        ).map(this::mapToStudentDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAdminDTO getStudentById(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));
        return mapToStudentDTO(student);
    }

    @Override
    public StudentAdminDTO createStudent(CreateStudentDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + dto.getEmail());
        }

        User user = User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword() != null && !dto.getPassword().trim().isEmpty() ? dto.getPassword() : "student123"))
                .role(Role.STUDENT)
                .status(AccountStatus.APPROVED)
                .build();
        User savedUser = userRepository.save(user);

        Student student = Student.builder()
                .user(savedUser)
                .name(dto.getName())
                .rollNumber(dto.getRollNumber())
                .branch(dto.getBranch())
                .cgpa(dto.getCgpa() != null ? dto.getCgpa() : 0.0)
                .graduationYear(dto.getGraduationYear() != null ? dto.getGraduationYear() : 2026)
                .phoneNumber(dto.getPhoneNumber())
                .isEligible(true)
                .build();

        Student savedStudent = studentRepository.save(student);
        return mapToStudentDTO(savedStudent);
    }

    @Override
    public StudentAdminDTO updateStudent(Long studentId, CreateStudentDTO dto) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        if (dto.getName() != null) student.setName(dto.getName());
        if (dto.getRollNumber() != null) student.setRollNumber(dto.getRollNumber());
        if (dto.getBranch() != null) student.setBranch(dto.getBranch());
        if (dto.getCgpa() != null) student.setCgpa(dto.getCgpa());
        if (dto.getGraduationYear() != null) student.setGraduationYear(dto.getGraduationYear());
        if (dto.getPhoneNumber() != null) student.setPhoneNumber(dto.getPhoneNumber());

        if (dto.getEmail() != null && !dto.getEmail().equalsIgnoreCase(student.getUser().getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("Email already registered: " + dto.getEmail());
            }
            student.getUser().setEmail(dto.getEmail().trim());
        }

        Student updated = studentRepository.save(student);
        return mapToStudentDTO(updated);
    }

    @Override
    public StudentAdminDTO updateStudentStatus(Long studentId, StatusUpdateDTO statusUpdate) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student", "id", studentId));

        if (statusUpdate.getStatus() != null) {
            AccountStatus newStatus = AccountStatus.valueOf(statusUpdate.getStatus().toUpperCase());
            student.getUser().setStatus(newStatus);
        }

        Student updated = studentRepository.save(student);
        return mapToStudentDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyAdminDTO> getAllCompanies(String query, CompanyStatus status, Pageable pageable) {
        return companyRepository.searchCompanies(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                status,
                pageable
        ).map(this::mapToCompanyDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyAdminDTO getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        return mapToCompanyDTO(company);
    }

    @Override
    public CompanyAdminDTO updateCompanyApprovalStatus(Long companyId, StatusUpdateDTO statusUpdate) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (statusUpdate.getStatus() != null) {
            CompanyStatus newStatus = CompanyStatus.valueOf(statusUpdate.getStatus().toUpperCase());
            company.setApprovalStatus(newStatus);
        }

        Company updated = companyRepository.save(company);
        return mapToCompanyDTO(updated);
    }

    @Override
    public CompanyAdminDTO updateCompanyAccountStatus(Long companyId, StatusUpdateDTO statusUpdate) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (statusUpdate.getStatus() != null) {
            AccountStatus newStatus = AccountStatus.valueOf(statusUpdate.getStatus().toUpperCase());
            company.getUser().setStatus(newStatus);
        }

        Company updated = companyRepository.save(company);
        return mapToCompanyDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DriveAdminDTO> getAllDrives(String query, DriveStatus status, Pageable pageable) {
        return driveRepository.searchDrives(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                status,
                pageable
        ).map(this::mapToDriveDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public DriveAdminDTO getDriveById(Long driveId) {
        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("PlacementDrive", "id", driveId));
        return mapToDriveDTO(drive);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ApplicationAdminDTO> getAllApplications(String query, ApplicationStatus status, Pageable pageable) {
        return applicationRepository.searchApplications(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                status,
                pageable
        ).map(this::mapToApplicationDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationAdminDTO getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToApplicationDTO(application);
    }

    // ── Helper Mappers ──────────────────────────────────────────────────

    private StudentAdminDTO mapToStudentDTO(Student s) {
        String placementStatus = "UNPLACED";
        boolean hasSelected = applicationRepository.findAll().stream()
                .anyMatch(a -> a.getStudent().getId().equals(s.getId()) && a.getStatus() == ApplicationStatus.SELECTED);
        if (hasSelected) {
            placementStatus = "PLACED";
        } else {
            boolean hasApplied = applicationRepository.findAll().stream()
                    .anyMatch(a -> a.getStudent().getId().equals(s.getId()));
            if (hasApplied) placementStatus = "APPLIED";
        }

        return StudentAdminDTO.builder()
                .id(s.getId())
                .userId(s.getUser().getId())
                .rollNumber(s.getRollNumber())
                .name(s.getName())
                .email(s.getUser().getEmail())
                .branch(s.getBranch())
                .cgpa(s.getCgpa())
                .graduationYear(s.getGraduationYear())
                .resumeUrl(s.getResumeUrl())
                .phoneNumber(s.getPhoneNumber())
                .isEligible(s.getIsEligible())
                .accountStatus(s.getUser().getStatus())
                .placementStatus(placementStatus)
                .build();
    }

    private CompanyAdminDTO mapToCompanyDTO(Company c) {
        long totalDrives = driveRepository.findAll().stream()
                .filter(d -> d.getCompany().getId().equals(c.getId()))
                .count();

        long totalPlacements = applicationRepository.findAll().stream()
                .filter(a -> a.getDrive().getCompany().getId().equals(c.getId()) && a.getStatus() == ApplicationStatus.SELECTED)
                .count();

        return CompanyAdminDTO.builder()
                .id(c.getId())
                .userId(c.getUser().getId())
                .companyName(c.getCompanyName())
                .industry(c.getIndustry())
                .website(c.getWebsite())
                .contactEmail(c.getContactEmail())
                .contactPhone(c.getContactPhone())
                .location(c.getLocation())
                .approvalStatus(c.getApprovalStatus())
                .accountStatus(c.getUser().getStatus())
                .totalDrives(totalDrives)
                .totalPlacements(totalPlacements)
                .build();
    }

    private DriveAdminDTO mapToDriveDTO(PlacementDrive d) {
        long appCount = applicationRepository.countByDriveId(d.getId());
        long selCount = applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.SELECTED);

        return DriveAdminDTO.builder()
                .id(d.getId())
                .companyId(d.getCompany().getId())
                .companyName(d.getCompany().getCompanyName())
                .jobTitle(d.getJobTitle())
                .description(d.getDescription())
                .eligibilityCgpa(d.getEligibilityCgpa())
                .ctc(d.getCtc())
                .location(d.getLocation())
                .status(d.getStatus())
                .driveDate(d.getDriveDate())
                .deadline(d.getDeadline())
                .createdAt(d.getCreatedAt())
                .totalApplications(appCount)
                .selectedCount(selCount)
                .build();
    }

    private ApplicationAdminDTO mapToApplicationDTO(Application a) {
        return ApplicationAdminDTO.builder()
                .id(a.getId())
                .studentId(a.getStudent().getId())
                .studentName(a.getStudent().getName())
                .rollNumber(a.getStudent().getRollNumber())
                .branch(a.getStudent().getBranch())
                .cgpa(a.getStudent().getCgpa())
                .driveId(a.getDrive().getId())
                .companyName(a.getDrive().getCompany().getCompanyName())
                .jobTitle(a.getDrive().getJobTitle())
                .ctc(a.getDrive().getCtc())
                .status(a.getStatus())
                .appliedAt(a.getAppliedAt())
                .build();
    }
}
