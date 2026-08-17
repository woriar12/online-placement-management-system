package com.placement.management.controller;

import com.placement.management.dto.*;
import com.placement.management.entity.ApplicationStatus;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * Student submits application for a placement drive.
     */
    @PostMapping("/apply")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> applyForDrive(
            @Valid @RequestBody ApplicationRequestDto requestDto) {
        ApplicationResponseDto response = applicationService.applyForDrive(requestDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Application submitted successfully", response));
    }

    /**
     * View applications submitted by logged-in student (or student specified by profile ID).
     */
    @GetMapping("/my-applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getMyApplications(
            @RequestParam(required = false, defaultValue = "1") Long studentProfileId) {
        List<ApplicationResponseDto> applications = applicationService.getStudentApplications(studentProfileId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Applications fetched successfully", applications));
    }

    /**
     * Get single application details with history and interview rounds.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> getApplicationById(@PathVariable Long id) {
        ApplicationResponseDto application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(new ApiResponse<>(true, "Application details retrieved", application));
    }

    /**
     * Company or Admin views applications for a specific placement drive with optional filters.
     */
    @GetMapping("/drive/{driveId}")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> getApplicationsForDrive(
            @PathVariable Long driveId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String department,
            @RequestParam(required = false) Double minCgpa) {
        List<ApplicationResponseDto> applications = applicationService.getApplicationsForDrive(driveId, status, department, minCgpa);
        return ResponseEntity.ok(new ApiResponse<>(true, "Drive applications fetched", applications));
    }

    /**
     * Shortlist multiple candidates for a placement drive.
     */
    @PostMapping("/shortlist")
    public ResponseEntity<ApiResponse<List<ApplicationResponseDto>>> shortlistCandidates(
            @Valid @RequestBody BulkShortlistRequestDto shortlistDto) {
        List<ApplicationResponseDto> shortlisted = applicationService.shortlistCandidates(shortlistDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Candidates shortlisted successfully", shortlisted));
    }

    /**
     * Update application status (Under Review, Shortlisted, Rejected, etc.).
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ApplicationStatusUpdateRequestDto updateDto) {
        ApplicationResponseDto updated = applicationService.updateApplicationStatus(id, updateDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Application status updated", updated));
    }

    /**
     * Student withdraws an application.
     */
    @PutMapping("/{id}/withdraw")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> withdrawApplication(
            @PathVariable Long id,
            @RequestParam(required = false) Long studentProfileId) {
        ApplicationResponseDto withdrawn = applicationService.withdrawApplication(id, studentProfileId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Application withdrawn successfully", withdrawn));
    }

    /**
     * Declare final selection or rejection outcome.
     */
    @PutMapping("/{id}/selection")
    public ResponseEntity<ApiResponse<ApplicationResponseDto>> updateSelection(
            @PathVariable Long id,
            @Valid @RequestBody SelectionUpdateRequestDto selectionDto) {
        ApplicationResponseDto updated = applicationService.updateSelectionStatus(id, selectionDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Selection status updated successfully", updated));
    }
}
