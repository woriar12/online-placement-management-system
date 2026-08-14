package com.placement.management.dto.admin;

import com.placement.management.entity.enums.AccountStatus;
import com.placement.management.entity.enums.CompanyStatus;
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
    private CompanyStatus approvalStatus;
    private AccountStatus accountStatus;
    private long totalDrives;
    private long totalPlacements;
}
