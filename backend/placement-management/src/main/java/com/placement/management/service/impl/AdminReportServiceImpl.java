package com.placement.management.service.impl;

import com.placement.management.dto.admin.*;
import com.placement.management.entity.Company;
import com.placement.management.entity.PlacementDrive;
import com.placement.management.entity.Student;
import com.placement.management.entity.enums.ApplicationStatus;
import com.placement.management.repository.*;
import com.placement.management.service.AdminReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class AdminReportServiceImpl implements AdminReportService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;

    public AdminReportServiceImpl(
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository driveRepository,
            ApplicationRepository applicationRepository) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public PlacementReportDTO getOverallPlacementReport() {
        long totalStudents = studentRepository.count();
        long eligibleStudents = studentRepository.countByIsEligibleTrue();
        long studentsPlaced = applicationRepository.countDistinctSelectedStudents();
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
            List<PlacementDrive> drives = driveRepository.findAll().stream()
                    .filter(d -> d.getCompany().getId().equals(c.getId()))
                    .collect(Collectors.toList());

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
                    long totalApps = applicationRepository.countByDriveId(d.getId());
                    long shortlisted = applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.SHORTLISTED) +
                            applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.INTERVIEWING) +
                            applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.SELECTED);
                    long selected = applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.SELECTED);

                    reports.add(CompanyPlacementReportDTO.builder()
                            .companyName(c.getCompanyName())
                            .placementDrive(d.getJobTitle())
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
        List<String> branches = studentRepository.findDistinctBranches();
        if (branches.isEmpty()) {
            branches = Arrays.asList("Computer Science", "Information Technology", "Electronics", "Mechanical", "Civil");
        }

        List<DepartmentPlacementReportDTO> reports = new ArrayList<>();
        List<Student> allStudents = studentRepository.findAll();

        for (String dept : branches) {
            List<Student> deptStudents = allStudents.stream()
                    .filter(s -> dept.equalsIgnoreCase(s.getBranch()))
                    .collect(Collectors.toList());

            long total = deptStudents.size();
            long eligible = deptStudents.stream().filter(s -> Boolean.TRUE.equals(s.getIsEligible())).count();
            long selected = applicationRepository.countSelectedStudentsByBranch(dept);

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
        List<Integer> years = studentRepository.findDistinctGraduationYears();
        if (years.isEmpty()) {
            years = Arrays.asList(2025, 2026);
        }

        List<YearPlacementReportDTO> reports = new ArrayList<>();
        List<Student> allStudents = studentRepository.findAll();

        for (Integer yr : years) {
            long total = allStudents.stream()
                    .filter(s -> Objects.equals(s.getGraduationYear(), yr))
                    .count();
            long selected = applicationRepository.countSelectedStudentsByYear(yr);
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
            long totalApps = applicationRepository.countByDriveId(d.getId());
            long shortlisted = applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.SHORTLISTED) +
                    applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.INTERVIEWING);
            long selected = applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.SELECTED);
            long rejected = applicationRepository.countByDriveIdAndStatus(d.getId(), ApplicationStatus.REJECTED);

            reports.add(DriveReportDTO.builder()
                    .company(d.getCompany().getCompanyName())
                    .drive(d.getJobTitle())
                    .applications(totalApps)
                    .shortlisted(shortlisted)
                    .selected(selected)
                    .rejected(rejected)
                    .build());
        }

        return reports;
    }
}
