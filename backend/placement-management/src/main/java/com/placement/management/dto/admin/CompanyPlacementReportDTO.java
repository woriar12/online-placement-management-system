package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyPlacementReportDTO {
    private String companyName;
    private String placementDrive;
    private long totalApplications;
    private long shortlistedCount;
    private long selectedCount;
}
