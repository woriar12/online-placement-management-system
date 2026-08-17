package com.placement.management.dto;

import com.placement.management.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;

public class SelectionUpdateRequestDto {

    @NotNull(message = "Status (SELECTED or REJECTED) is required")
    private ApplicationStatus status;

    private Double offeredCtc;

    private String selectionRemarks;

    public SelectionUpdateRequestDto() {}

    public SelectionUpdateRequestDto(ApplicationStatus status, Double offeredCtc, String selectionRemarks) {
        this.status = status;
        this.offeredCtc = offeredCtc;
        this.selectionRemarks = selectionRemarks;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public Double getOfferedCtc() {
        return offeredCtc;
    }

    public void setOfferedCtc(Double offeredCtc) {
        this.offeredCtc = offeredCtc;
    }

    public String getSelectionRemarks() {
        return selectionRemarks;
    }

    public void setSelectionRemarks(String selectionRemarks) {
        this.selectionRemarks = selectionRemarks;
    }
}
