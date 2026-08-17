package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentAdminDTO {
    private Long id;
    private Long userId;
    private String rollNumber;
    private String name;
    private String email;
    private String branch;
    private Double cgpa;
    private Integer graduationYear;
    private String resumeUrl;
    private String phoneNumber;
    private Boolean isEligible;
    private String placementStatus; // e.g. "PLACED", "UNPLACED", "APPLIED"
}
