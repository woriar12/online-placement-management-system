package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriveReportDTO {
    private String company;
    private String drive;
    private long applications;
    private long shortlisted;
    private long selected;
    private long rejected;
}
