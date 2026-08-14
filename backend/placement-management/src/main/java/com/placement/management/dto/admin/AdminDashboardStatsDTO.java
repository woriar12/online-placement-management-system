package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsDTO {
    private long totalStudents;
    private long totalCompanies;
    private long totalPlacementDrives;
    private long totalApplications;
    private long totalSelectedStudents;
    private long totalRejectedStudents;
    private long totalPendingApplications;
    private double placementPercentage;

    private List<DriveAdminDTO> recentDrives;
    private List<ApplicationAdminDTO> recentApplications;
    private List<ApplicationAdminDTO> recentSelections;
    private List<DriveAdminDTO> upcomingDrives;
}
