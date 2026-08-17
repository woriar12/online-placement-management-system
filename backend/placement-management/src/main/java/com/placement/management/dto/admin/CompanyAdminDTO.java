package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyAdminDTO {
    private Long id;
    private Long userId;
    private String companyName;
    private String industry;
    private String website;
    private String contactEmail;
    private String contactPhone;
    private String location;
    private long totalDrives;
    private long totalPlacements;
}
