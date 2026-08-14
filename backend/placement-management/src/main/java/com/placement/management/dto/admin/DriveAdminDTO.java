package com.placement.management.dto.admin;

import com.placement.management.entity.enums.DriveStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriveAdminDTO {
    private Long id;
    private Long companyId;
    private String companyName;
    private String jobTitle;
    private String description;
    private Double eligibilityCgpa;
    private Double ctc;
    private String location;
    private DriveStatus status;
    private LocalDate driveDate;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;
    private long totalApplications;
    private long selectedCount;
}
