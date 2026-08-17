package com.placement.management.dto.admin;

import com.placement.management.entity.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApplicationAdminDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private String branch;
    private Double cgpa;
    private Long driveId;
    private String companyName;
    private String jobTitle;
    private Double ctc;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
}
