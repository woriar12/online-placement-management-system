package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusUpdateDTO {
    private String status; // e.g. "APPROVED", "REJECTED", "DEACTIVATED", "ACTIVE"
    private String reason;
}
