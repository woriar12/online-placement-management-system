package com.placement.management.dto;

import com.placement.management.entity.InterviewStatus;
import jakarta.validation.constraints.NotNull;

public class InterviewStatusUpdateRequestDto {

    @NotNull(message = "Interview status is required")
    private InterviewStatus status;

    private String interviewerFeedback;

    private Double score;

    public InterviewStatusUpdateRequestDto() {}

    public InterviewStatusUpdateRequestDto(InterviewStatus status, String interviewerFeedback, Double score) {
        this.status = status;
        this.interviewerFeedback = interviewerFeedback;
        this.score = score;
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
