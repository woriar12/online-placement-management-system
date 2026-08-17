package com.placement.management.dto;

import com.placement.management.entity.ApplicationStatus;
import java.time.LocalDateTime;
import java.util.List;

public class ApplicationResponseDto {

    private Long id;
    private Long studentProfileId;
    private String studentName;
    private String rollNumber;
    private String department;
    private Double cgpa;
    private String studentEmail;
    
    private Long placementDriveId;
    private String driveTitle;
    private String companyName;
    private String jobRole;
    private Double driveCtc;

    private LocalDateTime appliedAt;
    private ApplicationStatus status;
    private String resumeUrl;
    private String coverNote;
    private String remarks;

    private Double offeredCtc;
    private String selectionRemarks;

    private Integer interviewRoundsCount;
    private List<InterviewRoundResponseDto> interviewRounds;

    public ApplicationResponseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(Long studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public Long getPlacementDriveId() {
        return placementDriveId;
    }

    public void setPlacementDriveId(Long placementDriveId) {
        this.placementDriveId = placementDriveId;
    }

    public String getDriveTitle() {
        return driveTitle;
    }

    public void setDriveTitle(String driveTitle) {
        this.driveTitle = driveTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public Double getDriveCtc() {
        return driveCtc;
    }

    public void setDriveCtc(Double driveCtc) {
        this.driveCtc = driveCtc;
    }

    public LocalDateTime getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(LocalDateTime appliedAt) {
        this.appliedAt = appliedAt;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
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

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
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

    public Integer getInterviewRoundsCount() {
        return interviewRoundsCount;
    }

    public void setInterviewRoundsCount(Integer interviewRoundsCount) {
        this.interviewRoundsCount = interviewRoundsCount;
    }

    public List<InterviewRoundResponseDto> getInterviewRounds() {
        return interviewRounds;
    }

    public void setInterviewRounds(List<InterviewRoundResponseDto> interviewRounds) {
        this.interviewRounds = interviewRounds;
    }
}
