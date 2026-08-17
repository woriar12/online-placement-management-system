package com.placement.management.service;

import com.placement.management.dto.*;
import com.placement.management.entity.ApplicationStatus;

import java.util.List;

public interface ApplicationService {

    ApplicationResponseDto applyForDrive(ApplicationRequestDto requestDto);

    List<ApplicationResponseDto> getStudentApplications(Long studentProfileId);

    ApplicationResponseDto getApplicationById(Long applicationId);

    List<ApplicationResponseDto> getApplicationsForDrive(Long driveId, ApplicationStatus status, String department, Double minCgpa);

    List<ApplicationResponseDto> shortlistCandidates(BulkShortlistRequestDto shortlistDto);

    ApplicationResponseDto updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequestDto updateDto);

    ApplicationResponseDto withdrawApplication(Long applicationId, Long studentProfileId);

    ApplicationResponseDto updateSelectionStatus(Long applicationId, SelectionUpdateRequestDto selectionDto);
}
