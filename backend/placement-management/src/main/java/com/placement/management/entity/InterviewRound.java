package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_rounds")
public class InterviewRound {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "application_id", nullable = false)
    private Application application;

    @Column(nullable = false)
    private Integer roundNumber;

    @Column(nullable = false)
    private String roundName;

    @Column(nullable = false)
    private LocalDateTime scheduledDateTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewMode mode;

    private String venueOrLink;

    @Column(columnDefinition = "TEXT")
    private String instructions;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InterviewStatus status;

    @Column(columnDefinition = "TEXT")
    private String interviewerFeedback;

    private Double score;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public InterviewRound() {}

    public InterviewRound(Long id, Application application, Integer roundNumber, String roundName, LocalDateTime scheduledDateTime, InterviewMode mode, String venueOrLink, String instructions, InterviewStatus status, String interviewerFeedback, Double score) {
        this.id = id;
        this.application = application;
        this.roundNumber = roundNumber;
        this.roundName = roundName;
        this.scheduledDateTime = scheduledDateTime;
        this.mode = mode;
        this.venueOrLink = venueOrLink;
        this.instructions = instructions;
        this.status = status;
        this.interviewerFeedback = interviewerFeedback;
        this.score = score;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = InterviewStatus.SCHEDULED;
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Application getApplication() {
        return application;
    }

    public void setApplication(Application application) {
        this.application = application;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
