package com.placement.management.dto;

import com.placement.management.entity.InterviewMode;
import com.placement.management.entity.InterviewStatus;
import java.time.LocalDateTime;

public class InterviewRoundResponseDto {

    private Long id;
    private Long applicationId;
    private String studentName;
    private String rollNumber;
    private String driveTitle;
    private String companyName;
    
    private Integer roundNumber;
    private String roundName;
    private LocalDateTime scheduledDateTime;
    private InterviewMode mode;
    private String venueOrLink;
    private String instructions;
    private InterviewStatus status;
    private String interviewerFeedback;
    private Double score;

    public InterviewRoundResponseDto() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getApplicationId() {
        return applicationId;
    }

    public void setApplicationId(Long applicationId) {
        this.applicationId = applicationId;
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

    public Integer getRoundNumber() {
        return roundNumber;
    }

    public void setRoundNumber(Integer roundNumber) {
        this.roundNumber = roundNumber;
    }

    public String getRoundName() {
        return roundName;
    }

    public void setRoundName(String roundName) {
        this.roundName = roundName;
    }

    public LocalDateTime getScheduledDateTime() {
        return scheduledDateTime;
    }

    public void setScheduledDateTime(LocalDateTime scheduledDateTime) {
        this.scheduledDateTime = scheduledDateTime;
    }

    public InterviewMode getMode() {
        return mode;
    }

    public void setMode(InterviewMode mode) {
        this.mode = mode;
    }

    public String getVenueOrLink() {
        return venueOrLink;
    }

    public void setVenueOrLink(String venueOrLink) {
        this.venueOrLink = venueOrLink;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public InterviewStatus getStatus() {
        return status;
    }

    public void setStatus(InterviewStatus status) {
        this.status = status;
    }

    public String getInterviewerFeedback() {
        return interviewerFeedback;
    }

    public void setInterviewerFeedback(String interviewerFeedback) {
        this.interviewerFeedback = interviewerFeedback;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}
