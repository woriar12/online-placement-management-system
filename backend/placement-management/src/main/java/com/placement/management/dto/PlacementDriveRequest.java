package com.placement.management.dto;

import com.placement.management.entity.DriveStatus;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

/**
 * Request DTO for creating or updating a {@link com.placement.management.entity.PlacementDrive}.
 *
 * @author Team — feature/company-drive
 */
public class PlacementDriveRequest {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Drive title is required")
    private String title;

    private String jobDescription;

    private String eligibilityCriteria;

    @DecimalMin(value = "0.0", message = "Min CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "Min CGPA cannot exceed 10.0")
    private Double minCgpa;

    /** Comma-separated branch codes, e.g. "CSE,ECE,IT". Use "*" for all branches. */
    private String allowedBranches;

    @DecimalMin(value = "0.0", message = "Package cannot be negative")
    private Double packageLpa;

    private String jobLocation;

    private LocalDate driveDate;

    private LocalDate applicationDeadline;

    private DriveStatus status;

    // ── Getters & Setters ────────────────────────────────────────────────────

    public Long getCompanyId() { return companyId; }
    public void setCompanyId(Long companyId) { this.companyId = companyId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getJobDescription() { return jobDescription; }
    public void setJobDescription(String jobDescription) { this.jobDescription = jobDescription; }

    public String getEligibilityCriteria() { return eligibilityCriteria; }
    public void setEligibilityCriteria(String eligibilityCriteria) { this.eligibilityCriteria = eligibilityCriteria; }

    public Double getMinCgpa() { return minCgpa; }
    public void setMinCgpa(Double minCgpa) { this.minCgpa = minCgpa; }

    public String getAllowedBranches() { return allowedBranches; }
    public void setAllowedBranches(String allowedBranches) { this.allowedBranches = allowedBranches; }

    public Double getPackageLpa() { return packageLpa; }
    public void setPackageLpa(Double packageLpa) { this.packageLpa = packageLpa; }

    public String getJobLocation() { return jobLocation; }
    public void setJobLocation(String jobLocation) { this.jobLocation = jobLocation; }

    public LocalDate getDriveDate() { return driveDate; }
    public void setDriveDate(LocalDate driveDate) { this.driveDate = driveDate; }

    public LocalDate getApplicationDeadline() { return applicationDeadline; }
    public void setApplicationDeadline(LocalDate applicationDeadline) { this.applicationDeadline = applicationDeadline; }

    public DriveStatus getStatus() { return status; }
    public void setStatus(DriveStatus status) { this.status = status; }
}
