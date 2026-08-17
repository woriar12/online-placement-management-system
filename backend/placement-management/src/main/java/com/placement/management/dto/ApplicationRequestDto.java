package com.placement.management.dto;

import jakarta.validation.constraints.NotNull;

public class ApplicationRequestDto {

    @NotNull(message = "Placement Drive ID is required")
    private Long placementDriveId;

    private Long studentProfileId; // Optional if derived from security context

    private String resumeUrl;

    private String coverNote;

    public ApplicationRequestDto() {}

    public ApplicationRequestDto(Long placementDriveId, Long studentProfileId, String resumeUrl, String coverNote) {
        this.placementDriveId = placementDriveId;
        this.studentProfileId = studentProfileId;
        this.resumeUrl = resumeUrl;
        this.coverNote = coverNote;
    }

    public Long getPlacementDriveId() {
        return placementDriveId;
    }

    public void setPlacementDriveId(Long placementDriveId) {
        this.placementDriveId = placementDriveId;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getCoverNote() {
        return coverNote;
    }

    public void setCoverNote(String coverNote) {
        this.coverNote = coverNote;
    }
}
