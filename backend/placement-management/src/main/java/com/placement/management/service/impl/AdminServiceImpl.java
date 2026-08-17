package com.placement.management.service.impl;

import com.placement.management.dto.admin.*;
import com.placement.management.entity.*;
import com.placement.management.exception.ResourceNotFoundException;
import com.placement.management.repository.*;
import com.placement.management.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminServiceImpl(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository driveRepository,
            ApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminDashboardStatsDTO getDashboardStats() {
        long totalStudents = studentProfileRepository.count();
        long totalCompanies = companyRepository.count();
        long totalDrives = driveRepository.count();
        long totalApplications = applicationRepository.count();
        long totalSelected = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long totalRejected = applicationRepository.countByStatus(ApplicationStatus.REJECTED);
        long totalPending = applicationRepository.countByStatus(ApplicationStatus.APPLIED);

        double placementPercentage = totalStudents > 0
                ? ((double) totalSelected / totalStudents) * 100.0
                : 0.0;

        List<DriveAdminDTO> recentDrives = driveRepository.findTop5ByOrderByCreatedAtDesc()
                .stream().map(this::mapToDriveDTO).collect(Collectors.toList());

        List<ApplicationAdminDTO> recentApplications = applicationRepository.findTop5ByOrderByAppliedAtDesc()
                .stream().map(this::mapToApplicationDTO).collect(Collectors.toList());

        List<ApplicationAdminDTO> recentSelections = applicationRepository.findTop5ByStatusOrderByAppliedAtDesc(ApplicationStatus.SELECTED)
                .stream().map(this::mapToApplicationDTO).collect(Collectors.toList());

        List<DriveAdminDTO> upcomingDrives = driveRepository.findByStatus(DriveStatus.UPCOMING)
                .stream().limit(5).map(this::mapToDriveDTO).collect(Collectors.toList());

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
        List<StudentProfile> profiles = studentProfileRepository.findAll();
        List<StudentAdminDTO> dtos = profiles.stream()
                .filter(p -> (query == null || query.isBlank() || (p.getUser() != null && p.getUser().getName().toLowerCase().contains(query.toLowerCase())) || (p.getRegisterNumber() != null && p.getRegisterNumber().toLowerCase().contains(query.toLowerCase()))))
                .filter(p -> (branch == null || branch.isBlank() || (p.getDepartment() != null && p.getDepartment().equalsIgnoreCase(branch))))
                .map(this::mapToStudentDTO)
                .collect(Collectors.toList());

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), dtos.size());
        List<StudentAdminDTO> subList = start <= dtos.size() ? dtos.subList(start, end) : List.of();
        return new PageImpl<>(subList, pageable, dtos.size());
    }

    @Override
    @Transactional(readOnly = true)
    public StudentAdminDTO getStudentById(Long studentId) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "id", studentId));
        return mapToStudentDTO(student);
    }

    @Override
    public StudentAdminDTO createStudent(CreateStudentDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + dto.getEmail());
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword() != null && !dto.getPassword().trim().isEmpty() ? dto.getPassword() : "student123"));
        user.setRole(Role.STUDENT);
        user.setEnabled(true);
        User savedUser = userRepository.save(user);

        StudentProfile profile = new StudentProfile();
        profile.setUser(savedUser);
        profile.setRegisterNumber(dto.getRollNumber());
        profile.setDepartment(dto.getBranch());
        profile.setCgpa(dto.getCgpa() != null ? dto.getCgpa() : 0.0);
        profile.setGraduationYear(dto.getGraduationYear() != null ? dto.getGraduationYear() : 2026);

        StudentProfile savedStudent = studentProfileRepository.save(profile);
        return mapToStudentDTO(savedStudent);
    }

    @Override
    public StudentAdminDTO updateStudent(Long studentId, CreateStudentDTO dto) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "id", studentId));

        if (dto.getRollNumber() != null) student.setRegisterNumber(dto.getRollNumber());
        if (dto.getBranch() != null) student.setDepartment(dto.getBranch());
        if (dto.getCgpa() != null) student.setCgpa(dto.getCgpa());
        if (dto.getGraduationYear() != null) student.setGraduationYear(dto.getGraduationYear());

        if (dto.getEmail() != null && student.getUser() != null && !dto.getEmail().equalsIgnoreCase(student.getUser().getEmail())) {
            if (userRepository.existsByEmail(dto.getEmail())) {
                throw new IllegalArgumentException("Email already registered: " + dto.getEmail());
            }
            student.getUser().setEmail(dto.getEmail().trim());
        }
        if (dto.getName() != null && student.getUser() != null) {
            student.getUser().setName(dto.getName());
        }

        StudentProfile updated = studentProfileRepository.save(student);
        return mapToStudentDTO(updated);
    }

    @Override
    public StudentAdminDTO updateStudentStatus(Long studentId, StatusUpdateDTO statusUpdate) {
        StudentProfile student = studentProfileRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("StudentProfile", "id", studentId));

        if (statusUpdate.getStatus() != null && student.getUser() != null) {
            student.getUser().setEnabled("ACTIVE".equalsIgnoreCase(statusUpdate.getStatus()) || "APPROVED".equalsIgnoreCase(statusUpdate.getStatus()));
            userRepository.save(student.getUser());
        }

        return mapToStudentDTO(student);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyAdminDTO> getAllCompanies(String query, Pageable pageable) {
        Page<Company> page = (query != null && !query.isBlank())
                ? companyRepository.findByNameContainingIgnoreCase(query, pageable)
                : companyRepository.findAll(pageable);
        return page.map(this::mapToCompanyDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyAdminDTO getCompanyById(Long companyId) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));
        return mapToCompanyDTO(company);
    }

    @Override
    public CompanyAdminDTO updateCompanyAccountStatus(Long companyId, StatusUpdateDTO statusUpdate) {
        Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Company", "id", companyId));

        if (statusUpdate.getStatus() != null) {
            company.setActive("ACTIVE".equalsIgnoreCase(statusUpdate.getStatus()) || "APPROVED".equalsIgnoreCase(statusUpdate.getStatus()));
        }

        Company updated = companyRepository.save(company);
        return mapToCompanyDTO(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DriveAdminDTO> getAllDrives(String query, DriveStatus status, Pageable pageable) {
        Page<PlacementDrive> page = driveRepository.findAllByStatusOptional(status, pageable);
        return page.map(this::mapToDriveDTO);
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
        Page<Application> page = applicationRepository.findAll(pageable);
        return page.map(this::mapToApplicationDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationAdminDTO getApplicationById(Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        return mapToApplicationDTO(application);
    }

    // ── Helper Mappers ──────────────────────────────────────────────────

    private StudentAdminDTO mapToStudentDTO(StudentProfile s) {
        String placementStatus = "UNPLACED";
        boolean hasSelected = applicationRepository.findAll().stream()
                .anyMatch(a -> a.getStudentProfile() != null && a.getStudentProfile().getId().equals(s.getId()) && a.getStatus() == ApplicationStatus.SELECTED);
        if (hasSelected) {
            placementStatus = "PLACED";
        } else {
            boolean hasApplied = applicationRepository.findAll().stream()
                    .anyMatch(a -> a.getStudentProfile() != null && a.getStudentProfile().getId().equals(s.getId()));
            if (hasApplied) placementStatus = "APPLIED";
        }

        return StudentAdminDTO.builder()
                .id(s.getId())
                .userId(s.getUser() != null ? s.getUser().getId() : null)
                .rollNumber(s.getRegisterNumber())
                .name(s.getUser() != null ? s.getUser().getName() : "Student #" + s.getId())
                .email(s.getUser() != null ? s.getUser().getEmail() : "")
                .branch(s.getDepartment())
                .cgpa(s.getCgpa())
                .graduationYear(s.getGraduationYear())
                .resumeUrl(s.getResumeUrl())
                .phoneNumber(s.getUser() != null ? s.getUser().getPhoneNumber() : "")
                .isEligible(true)
                .placementStatus(placementStatus)
                .build();
    }

    private CompanyAdminDTO mapToCompanyDTO(Company c) {
        long totalDrives = driveRepository.findByCompanyId(c.getId()).size();

        long totalPlacements = applicationRepository.findAll().stream()
                .filter(a -> a.getPlacementDrive() != null && a.getPlacementDrive().getCompany() != null && a.getPlacementDrive().getCompany().getId().equals(c.getId()) && a.getStatus() == ApplicationStatus.SELECTED)
                .count();

        return CompanyAdminDTO.builder()
                .id(c.getId())
                .companyName(c.getCompanyName())
                .industry(c.getIndustry())
                .website(c.getWebsite())
                .contactEmail(c.getHrContactEmail())
                .contactPhone(c.getPhone())
                .location(c.getLocation())
                .totalDrives(totalDrives)
                .totalPlacements(totalPlacements)
                .build();
    }

    private DriveAdminDTO mapToDriveDTO(PlacementDrive d) {
        long appCount = applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(d.getId()).size();
        long selCount = applicationRepository.findByPlacementDriveIdAndStatus(d.getId(), ApplicationStatus.SELECTED).size();

        return DriveAdminDTO.builder()
                .id(d.getId())
                .companyId(d.getCompany() != null ? d.getCompany().getId() : null)
                .companyName(d.getCompany() != null ? d.getCompany().getCompanyName() : "N/A")
                .jobTitle(d.getJobRole())
                .description(d.getJobDescription())
                .eligibilityCgpa(d.getMinCgpa())
                .ctc(d.getCtc())
                .location(d.getJobLocation())
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
                .studentId(a.getStudentProfile() != null ? a.getStudentProfile().getId() : null)
                .studentName(a.getStudentProfile() != null && a.getStudentProfile().getUser() != null ? a.getStudentProfile().getUser().getName() : "N/A")
                .rollNumber(a.getStudentProfile() != null ? a.getStudentProfile().getRegisterNumber() : "N/A")
                .branch(a.getStudentProfile() != null ? a.getStudentProfile().getDepartment() : "N/A")
                .cgpa(a.getStudentProfile() != null ? a.getStudentProfile().getCgpa() : 0.0)
                .driveId(a.getPlacementDrive() != null ? a.getPlacementDrive().getId() : null)
                .companyName(a.getPlacementDrive() != null && a.getPlacementDrive().getCompany() != null ? a.getPlacementDrive().getCompany().getCompanyName() : "N/A")
                .jobTitle(a.getPlacementDrive() != null ? a.getPlacementDrive().getJobRole() : "N/A")
                .ctc(a.getPlacementDrive() != null ? a.getPlacementDrive().getCtc() : 0.0)
                .status(a.getStatus())
                .appliedAt(a.getAppliedAt())
                .build();
    }
}
