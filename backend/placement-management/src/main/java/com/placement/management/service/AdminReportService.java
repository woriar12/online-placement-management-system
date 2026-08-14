package com.placement.management.service;

import com.placement.management.dto.admin.*;

import java.util.List;

public interface AdminReportService {
    PlacementReportDTO getOverallPlacementReport();
    List<CompanyPlacementReportDTO> getCompanyPlacementReport();
    List<DepartmentPlacementReportDTO> getDepartmentPlacementReport();
    List<YearPlacementReportDTO> getYearPlacementReport();
    List<DriveReportDTO> getDriveReport();
}
