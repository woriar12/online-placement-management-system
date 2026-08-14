package com.placement.management.service;

import com.placement.management.dto.admin.*;
import com.placement.management.entity.enums.ApplicationStatus;
import com.placement.management.entity.enums.CompanyStatus;
import com.placement.management.entity.enums.DriveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    AdminDashboardStatsDTO getDashboardStats();

    Page<StudentAdminDTO> getAllStudents(String query, String branch, Pageable pageable);
    StudentAdminDTO getStudentById(Long studentId);
    StudentAdminDTO createStudent(CreateStudentDTO dto);
    StudentAdminDTO updateStudent(Long studentId, CreateStudentDTO dto);
    StudentAdminDTO updateStudentStatus(Long studentId, StatusUpdateDTO statusUpdate);

    Page<CompanyAdminDTO> getAllCompanies(String query, CompanyStatus status, Pageable pageable);
    CompanyAdminDTO getCompanyById(Long companyId);
    CompanyAdminDTO updateCompanyApprovalStatus(Long companyId, StatusUpdateDTO statusUpdate);
    CompanyAdminDTO updateCompanyAccountStatus(Long companyId, StatusUpdateDTO statusUpdate);

    Page<DriveAdminDTO> getAllDrives(String query, DriveStatus status, Pageable pageable);
    DriveAdminDTO getDriveById(Long driveId);

    Page<ApplicationAdminDTO> getAllApplications(String query, ApplicationStatus status, Pageable pageable);
    ApplicationAdminDTO getApplicationById(Long applicationId);
}
