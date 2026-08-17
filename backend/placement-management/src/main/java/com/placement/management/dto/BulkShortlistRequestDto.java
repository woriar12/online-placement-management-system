package com.placement.management.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class BulkShortlistRequestDto {

    @NotEmpty(message = "Application IDs list cannot be empty")
    private List<Long> applicationIds;

    private String remarks;

    public BulkShortlistRequestDto() {}

    public BulkShortlistRequestDto(List<Long> applicationIds, String remarks) {
        this.applicationIds = applicationIds;
        this.remarks = remarks;
    }

    public List<Long> getApplicationIds() {
        return applicationIds;
    }

    public void setApplicationIds(List<Long> applicationIds) {
        this.applicationIds = applicationIds;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
