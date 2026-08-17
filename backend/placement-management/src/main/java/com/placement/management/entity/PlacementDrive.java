package com.placement.management.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Represents a placement drive organized by a {@link Company}.
 *
 * @author Team — Admin Module, Company & Placement Drive, Application & Interview
 */
@Entity
@Table(name = "placement_drives")
public class PlacementDrive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "company_id", nullable = false, foreignKey = @ForeignKey(name = "fk_drive_company"))
    private Company company;

    @Column(nullable = false, length = 300)
    private String title;

    @Column(name = "job_description", columnDefinition = "TEXT")
    private String jobDescription;

    @Column(name = "eligibility_criteria", columnDefinition = "TEXT")
    private String eligibilityCriteria;

    @Column(name = "min_cgpa")
    private Double minCgpa;

    @Column(name = "allowed_branches", length = 500)
    private String allowedBranches;

    @Column(name = "package_lpa")
    private Double packageLpa;

    @Column(name = "job_location", length = 200)
    private String jobLocation;

    private String jobRole;
    private String location;
    private Double ctc;
    private String eligibleBranches;

    @Column(name = "drive_date")
    private LocalDate driveDate;

    @Column(name = "application_deadline")
    private LocalDate applicationDeadline;

    private LocalDateTime deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private DriveStatus status = DriveStatus.UPCOMING;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public PlacementDrive() {}

    public PlacementDrive(Long id, String title, Company company, String jobRole, String jobDescription, String location, Double ctc, Double minCgpa, String eligibleBranches, LocalDateTime deadline, LocalDateTime driveDate, DriveStatus status) {
        this.id = id;
        this.title = title;
        this.company = company;
        this.jobRole = jobRole;
        this.jobDescription = jobDescription;
        this.location = location;
        this.jobLocation = location;
        this.ctc = ctc;
        this.packageLpa = ctc;
        this.minCgpa = minCgpa;
        this.eligibleBranches = eligibleBranches;
        this.allowedBranches = eligibleBranches;
        this.deadline = deadline;
        if (deadline != null) {
            this.applicationDeadline = deadline.toLocalDate();
        }
        if (driveDate != null) {
            this.driveDate = driveDate.toLocalDate();
        }
        this.status = status;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Company getCompany() { return company; }
    public void setCompany(Company company) { this.company = company; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getJobTitle() { return title; }
    public void setJobTitle(String jobTitle) { this.title = jobTitle; }

    public String getJobRole() { return jobRole != null ? jobRole : title; }
    public void setJobRole(String jobRole) { this.jobRole = jobRole; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public Double getEligibilityCgpa() { return minCgpa; }
    public void setEligibilityCgpa(Double eligibilityCgpa) { this.minCgpa = eligibilityCgpa; }

    public String getAllowedBranches() { return allowedBranches != null ? allowedBranches : eligibleBranches; }
    public void setAllowedBranches(String allowedBranches) { this.allowedBranches = allowedBranches; }

    public String getEligibleBranches() { return eligibleBranches != null ? eligibleBranches : allowedBranches; }
    public void setEligibleBranches(String eligibleBranches) { this.eligibleBranches = eligibleBranches; }

    public Double getPackageLpa() { return packageLpa != null ? packageLpa : ctc; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }

    public Double getCtc() { return ctc != null ? ctc : packageLpa; }
    public void setCtc(Double ctc) { this.ctc = ctc; }

    public String getJobLocation() { return jobLocation != null ? jobLocation : location; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public String getLocation() { return location != null ? location : jobLocation; }
    public void setLocation(String location) { this.location = location; }

    public LocalDate getDriveDate() { return driveDate; }
    public void setDriveDate(LocalDate driveDate) { this.driveDate = driveDate; }

    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public LocalDateTime getDeadline() { return deadline; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }

    public DriveStatus getStatus() { return status; }
    public void setStatus(DriveStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
