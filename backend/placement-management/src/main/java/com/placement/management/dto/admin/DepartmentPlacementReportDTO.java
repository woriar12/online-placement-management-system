package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentPlacementReportDTO {
    private String department;
    private long totalStudents;
    private long eligibleStudents;
    private long selectedStudents;
    private double placementPercentage;
}
