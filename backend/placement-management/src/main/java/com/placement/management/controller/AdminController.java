package com.placement.management.controller;

import com.placement.management.dto.admin.*;
import com.placement.management.entity.ApplicationStatus;
import com.placement.management.entity.DriveStatus;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.AdminService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ── Dashboard Statistics ─────────────────────────────────────────────

    @GetMapping("/dashboard/stats")
    public ResponseEntity<ApiResponse<AdminDashboardStatsDTO>> getDashboardStats() {
        AdminDashboardStatsDTO stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats, "Admin dashboard statistics retrieved successfully"));
    }

    // ── Student Management ───────────────────────────────────────────────

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<Page<StudentAdminDTO>>> getStudents(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String branch,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<StudentAdminDTO> students = adminService.getAllStudents(query, branch, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(students, "Students retrieved successfully"));
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentAdminDTO>> getStudentById(@PathVariable Long id) {
        StudentAdminDTO student = adminService.getStudentById(id);
        return ResponseEntity.ok(ApiResponse.success(student, "Student details retrieved successfully"));
    }

    @PostMapping("/students")
    public ResponseEntity<ApiResponse<StudentAdminDTO>> createStudent(@RequestBody CreateStudentDTO dto) {
        StudentAdminDTO created = adminService.createStudent(dto);
        return ResponseEntity.status(org.springframework.http.HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Student created successfully"));
    }

    @PutMapping("/students/{id}")
    public ResponseEntity<ApiResponse<StudentAdminDTO>> updateStudent(
            @PathVariable Long id,
            @RequestBody CreateStudentDTO dto) {
        StudentAdminDTO updated = adminService.updateStudent(id, dto);
        return ResponseEntity.ok(ApiResponse.success(updated, "Student details updated successfully"));
    }

    @PutMapping("/students/{id}/status")
    public ResponseEntity<ApiResponse<StudentAdminDTO>> updateStudentStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO statusUpdate) {
        StudentAdminDTO updated = adminService.updateStudentStatus(id, statusUpdate);
        return ResponseEntity.ok(ApiResponse.success(updated, "Student account status updated successfully"));
    }

    // ── Company Management ───────────────────────────────────────────────

    @GetMapping("/companies")
    public ResponseEntity<ApiResponse<Page<CompanyAdminDTO>>> getCompanies(
            @RequestParam(required = false) String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<CompanyAdminDTO> companies = adminService.getAllCompanies(query, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(companies, "Companies retrieved successfully"));
    }

    @GetMapping("/companies/{id}")
    public ResponseEntity<ApiResponse<CompanyAdminDTO>> getCompanyById(@PathVariable Long id) {
        CompanyAdminDTO company = adminService.getCompanyById(id);
        return ResponseEntity.ok(ApiResponse.success(company, "Company details retrieved successfully"));
    }

    @PutMapping("/companies/{id}/status")
    public ResponseEntity<ApiResponse<CompanyAdminDTO>> updateCompanyAccountStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateDTO statusUpdate) {
        CompanyAdminDTO updated = adminService.updateCompanyAccountStatus(id, statusUpdate);
        return ResponseEntity.ok(ApiResponse.success(updated, "Company account status updated successfully"));
    }

    // ── Drive Monitoring ────────────────────────────────────────────────

    @GetMapping("/drives")
    public ResponseEntity<ApiResponse<Page<DriveAdminDTO>>> getDrives(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) DriveStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<DriveAdminDTO> drives = adminService.getAllDrives(query, status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(drives, "Placement drives retrieved successfully"));
    }

    @GetMapping("/drives/{id}")
    public ResponseEntity<ApiResponse<DriveAdminDTO>> getDriveById(@PathVariable Long id) {
        DriveAdminDTO drive = adminService.getDriveById(id);
        return ResponseEntity.ok(ApiResponse.success(drive, "Placement drive details retrieved successfully"));
    }

    // ── Application Monitoring ──────────────────────────────────────────

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<Page<ApplicationAdminDTO>>> getApplications(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "appliedAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Page<ApplicationAdminDTO> applications = adminService.getAllApplications(query, status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success(applications, "Applications retrieved successfully"));
    }

    @GetMapping("/applications/{id}")
    public ResponseEntity<ApiResponse<ApplicationAdminDTO>> getApplicationById(@PathVariable Long id) {
        ApplicationAdminDTO application = adminService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(application, "Application details retrieved successfully"));
    }
}
