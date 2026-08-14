package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlacementReportDTO {
    private long totalStudents;
    private long eligibleStudents;
    private long studentsPlaced;
    private long studentsNotPlaced;
    private double placementPercentage;
}
