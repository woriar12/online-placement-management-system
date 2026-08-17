package com.placement.management.service.impl;

import com.placement.management.dto.admin.*;
import com.placement.management.entity.Application;
import com.placement.management.entity.ApplicationStatus;
import com.placement.management.entity.Company;
import com.placement.management.entity.PlacementDrive;
import com.placement.management.entity.StudentProfile;
import com.placement.management.repository.*;
import com.placement.management.service.AdminReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminReportServiceImpl implements AdminReportService {

    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;

    public AdminReportServiceImpl(
            StudentProfileRepository studentProfileRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository driveRepository,
            ApplicationRepository applicationRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public PlacementReportDTO getOverallPlacementReport() {
        long totalStudents = studentProfileRepository.count();
        long eligibleStudents = totalStudents;
        long studentsPlaced = applicationRepository.countByStatus(ApplicationStatus.SELECTED);
        long studentsNotPlaced = Math.max(0, eligibleStudents - studentsPlaced);

        double placementPct = eligibleStudents > 0
                ? ((double) studentsPlaced / eligibleStudents) * 100.0
                : 0.0;

        return PlacementReportDTO.builder()
                .totalStudents(totalStudents)
                .eligibleStudents(eligibleStudents)
                .studentsPlaced(studentsPlaced)
                .studentsNotPlaced(studentsNotPlaced)
                .placementPercentage(Math.round(placementPct * 100.0) / 100.0)
                .build();
    }

    @Override
    public List<CompanyPlacementReportDTO> getCompanyPlacementReport() {
        List<Company> companies = companyRepository.findAll();
        List<CompanyPlacementReportDTO> reports = new ArrayList<>();

        for (Company c : companies) {
            List<PlacementDrive> drives = driveRepository.findByCompanyId(c.getId());

            if (drives.isEmpty()) {
                reports.add(CompanyPlacementReportDTO.builder()
                        .companyName(c.getCompanyName())
                        .placementDrive("No Active Drives")
                        .totalApplications(0)
                        .shortlistedCount(0)
                        .selectedCount(0)
                        .build());
            } else {
                for (PlacementDrive d : drives) {
                    List<Application> driveApps = applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(d.getId());
                    long totalApps = driveApps.size();
                    long shortlisted = driveApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED || a.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED || a.getStatus() == ApplicationStatus.SELECTED).count();
                    long selected = driveApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SELECTED).count();

                    reports.add(CompanyPlacementReportDTO.builder()
                            .companyName(c.getCompanyName())
                            .placementDrive(d.getJobRole())
                            .totalApplications(totalApps)
                            .shortlistedCount(shortlisted)
                            .selectedCount(selected)
                            .build());
                }
            }
        }
        return reports;
    }

    @Override
    public List<DepartmentPlacementReportDTO> getDepartmentPlacementReport() {
        List<StudentProfile> allStudents = studentProfileRepository.findAll();
        Set<String> branchesSet = allStudents.stream()
                .map(StudentProfile::getDepartment)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (branchesSet.isEmpty()) {
            branchesSet = Set.of("Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil");
        }

        List<DepartmentPlacementReportDTO> reports = new ArrayList<>();

        for (String dept : branchesSet) {
            List<StudentProfile> deptStudents = allStudents.stream()
                    .filter(s -> dept.equalsIgnoreCase(s.getDepartment()))
                    .collect(Collectors.toList());

            long total = deptStudents.size();
            long eligible = total;
            long selected = applicationRepository.findAll().stream()
                    .filter(a -> a.getStudentProfile() != null && dept.equalsIgnoreCase(a.getStudentProfile().getDepartment()) && a.getStatus() == ApplicationStatus.SELECTED)
                    .count();

            double pct = eligible > 0 ? ((double) selected / eligible) * 100.0 : 0.0;

            reports.add(DepartmentPlacementReportDTO.builder()
                    .department(dept)
                    .totalStudents(total)
                    .eligibleStudents(eligible)
                    .selectedStudents(selected)
                    .placementPercentage(Math.round(pct * 100.0) / 100.0)
                    .build());
        }

        return reports;
    }

    @Override
    public List<YearPlacementReportDTO> getYearPlacementReport() {
        List<StudentProfile> allStudents = studentProfileRepository.findAll();
        Set<Integer> yearsSet = allStudents.stream()
                .map(StudentProfile::getGraduationYear)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        if (yearsSet.isEmpty()) {
            yearsSet = Set.of(2025, 2026);
        }

        List<YearPlacementReportDTO> reports = new ArrayList<>();

        for (Integer yr : yearsSet) {
            long total = allStudents.stream()
                    .filter(s -> Objects.equals(s.getGraduationYear(), yr))
                    .count();
            long selected = applicationRepository.findAll().stream()
                    .filter(a -> a.getStudentProfile() != null && Objects.equals(a.getStudentProfile().getGraduationYear(), yr) && a.getStatus() == ApplicationStatus.SELECTED)
                    .count();
            double pct = total > 0 ? ((double) selected / total) * 100.0 : 0.0;

            reports.add(YearPlacementReportDTO.builder()
                    .academicYear(yr)
                    .totalStudents(total)
                    .selectedStudents(selected)
                    .placementPercentage(Math.round(pct * 100.0) / 100.0)
                    .build());
        }

        return reports;
    }

    @Override
    public List<DriveReportDTO> getDriveReport() {
        List<PlacementDrive> drives = driveRepository.findAll();
        List<DriveReportDTO> reports = new ArrayList<>();

        for (PlacementDrive d : drives) {
            List<Application> driveApps = applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(d.getId());
            long totalApps = driveApps.size();
            long shortlisted = driveApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SHORTLISTED || a.getStatus() == ApplicationStatus.INTERVIEW_SCHEDULED).count();
            long selected = driveApps.stream().filter(a -> a.getStatus() == ApplicationStatus.SELECTED).count();
            long rejected = driveApps.stream().filter(a -> a.getStatus() == ApplicationStatus.REJECTED).count();

            reports.add(DriveReportDTO.builder()
                    .company(d.getCompany() != null ? d.getCompany().getCompanyName() : "N/A")
                    .drive(d.getJobRole())
                    .applications(totalApps)
                    .shortlisted(shortlisted)
                    .selected(selected)
                    .rejected(rejected)
                    .build());
        }

        return reports;
    }
}
