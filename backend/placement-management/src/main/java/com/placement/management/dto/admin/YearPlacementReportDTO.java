package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YearPlacementReportDTO {
    private Integer academicYear;
    private long totalStudents;
    private long selectedStudents;
    private double placementPercentage;
}
