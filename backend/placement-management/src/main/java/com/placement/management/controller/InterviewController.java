package com.placement.management.controller;

import com.placement.management.dto.InterviewRoundResponseDto;
import com.placement.management.dto.InterviewScheduleRequestDto;
import com.placement.management.dto.InterviewStatusUpdateRequestDto;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.InterviewService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interviews")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    /**
     * Schedule an interview round for a shortlisted application.
     */
    @PostMapping("/schedule")
    public ResponseEntity<ApiResponse<InterviewRoundResponseDto>> scheduleInterview(
            @Valid @RequestBody InterviewScheduleRequestDto scheduleDto) {
        InterviewRoundResponseDto response = interviewService.scheduleInterview(scheduleDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>(true, "Interview round scheduled successfully", response));
    }

    /**
     * Get interview rounds for a specific application.
     */
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<ApiResponse<List<InterviewRoundResponseDto>>> getInterviewsForApplication(
            @PathVariable Long applicationId) {
        List<InterviewRoundResponseDto> interviews = interviewService.getInterviewsForApplication(applicationId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Application interviews retrieved", interviews));
    }

    /**
     * Get all interview rounds for a placement drive.
     */
    @GetMapping("/drive/{driveId}")
    public ResponseEntity<ApiResponse<List<InterviewRoundResponseDto>>> getInterviewsForDrive(
            @PathVariable Long driveId) {
        List<InterviewRoundResponseDto> interviews = interviewService.getInterviewsForDrive(driveId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Drive interviews retrieved", interviews));
    }

    /**
     * Get scheduled interviews for the logged-in student.
     */
    @GetMapping("/my-interviews")
    public ResponseEntity<ApiResponse<List<InterviewRoundResponseDto>>> getMyInterviews(
            @RequestParam(required = false, defaultValue = "1") Long studentProfileId) {
        List<InterviewRoundResponseDto> interviews = interviewService.getInterviewsForStudent(studentProfileId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Student interview schedule retrieved", interviews));
    }

    /**
     * Update status, feedback, and score of an interview round.
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<InterviewRoundResponseDto>> updateInterviewStatus(
            @PathVariable Long id,
            @Valid @RequestBody InterviewStatusUpdateRequestDto updateDto) {
        InterviewRoundResponseDto updated = interviewService.updateInterviewStatus(id, updateDto);
        return ResponseEntity.ok(new ApiResponse<>(true, "Interview round status updated", updated));
    }
}
