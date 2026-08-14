package com.placement.management.controller;

import com.placement.management.dto.admin.*;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.AdminReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/reports")
public class AdminReportController {

    private final AdminReportService reportService;

    public AdminReportController(AdminReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/overall")
    public ResponseEntity<ApiResponse<PlacementReportDTO>> getOverallReport() {
        PlacementReportDTO report = reportService.getOverallPlacementReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Overall placement report retrieved successfully"));
    }

    @GetMapping("/company")
    public ResponseEntity<ApiResponse<List<CompanyPlacementReportDTO>>> getCompanyReport() {
        List<CompanyPlacementReportDTO> report = reportService.getCompanyPlacementReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Company-wise placement report retrieved successfully"));
    }

    @GetMapping("/department")
    public ResponseEntity<ApiResponse<List<DepartmentPlacementReportDTO>>> getDepartmentReport() {
        List<DepartmentPlacementReportDTO> report = reportService.getDepartmentPlacementReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Department-wise placement report retrieved successfully"));
    }

    @GetMapping("/year")
    public ResponseEntity<ApiResponse<List<YearPlacementReportDTO>>> getYearReport() {
        List<YearPlacementReportDTO> report = reportService.getYearPlacementReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Year-wise placement report retrieved successfully"));
    }

    @GetMapping("/drive")
    public ResponseEntity<ApiResponse<List<DriveReportDTO>>> getDriveReport() {
        List<DriveReportDTO> report = reportService.getDriveReport();
        return ResponseEntity.ok(ApiResponse.success(report, "Drive-wise placement report retrieved successfully"));
    }
}
