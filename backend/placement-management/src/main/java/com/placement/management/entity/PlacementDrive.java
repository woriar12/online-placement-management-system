package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false)
    private String jobRole;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    private String location;

    private Double ctc;

    private Double minCgpa;

    private String eligibleBranches; // Comma separated, e.g., "CSE,ECE,IT"

    private LocalDateTime deadline;

    private LocalDateTime driveDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DriveStatus status;

    public PlacementDrive() {}

    public PlacementDrive(Long id, String title, Company company, String jobRole, String jobDescription, String location, Double ctc, Double minCgpa, String eligibleBranches, LocalDateTime deadline, LocalDateTime driveDate, DriveStatus status) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.jobRole = jobRole;
        this.jobDescription = jobDescription;
        this.location = location;
        this.ctc = ctc;
        this.minCgpa = minCgpa;
        this.eligibleBranches = eligibleBranches;
        this.deadline = deadline;
        this.driveDate = driveDate;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Company getCompany() {
        return company;
    }

    public void setCompany(Company company) {
        this.company = company;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Double getCtc() {
        return ctc;
    }

    public void setCtc(Double ctc) {
        this.ctc = ctc;
    }

    public Double getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(Double minCgpa) {
        this.minCgpa = minCgpa;
    }

    public String getEligibleBranches() {
        return eligibleBranches;
    }

    public void setEligibleBranches(String eligibleBranches) {
        this.eligibleBranches = eligibleBranches;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

    public LocalDateTime getDriveDate() {
        return driveDate;
    }

    public void setDriveDate(LocalDateTime driveDate) {
        this.driveDate = driveDate;
    }

    public DriveStatus getStatus() {
        return status;
    }

    public void setStatus(DriveStatus status) {
        this.status = status;
    }
}
