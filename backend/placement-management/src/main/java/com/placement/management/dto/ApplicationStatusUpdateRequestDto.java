package com.placement.management.dto;

import com.placement.management.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class ApplicationStatusUpdateRequestDto {

    @NotNull(message = "Status is required")
    private ApplicationStatus status;

    private String remarks;

    public ApplicationStatusUpdateRequestDto() {}

    public ApplicationStatusUpdateRequestDto(ApplicationStatus status, String remarks) {
        this.status = status;
        this.remarks = remarks;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
