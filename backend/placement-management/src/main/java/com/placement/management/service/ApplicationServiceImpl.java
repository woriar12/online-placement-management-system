package com.placement.management.service;

import com.placement.management.dto.*;
import com.placement.management.entity.*;
import com.placement.management.exception.ResourceNotFoundException;
import com.placement.management.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final InterviewRoundRepository interviewRoundRepository;

    public ApplicationServiceImpl(
            ApplicationRepository applicationRepository,
            StudentProfileRepository studentProfileRepository,
            PlacementDriveRepository placementDriveRepository,
            InterviewRoundRepository interviewRoundRepository) {
        this.applicationRepository = applicationRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.interviewRoundRepository = interviewRoundRepository;
    }

    @Override
    public ApplicationResponseDto applyForDrive(ApplicationRequestDto requestDto) {
        PlacementDrive drive = placementDriveRepository.findById(requestDto.getPlacementDriveId())
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + requestDto.getPlacementDriveId()));

        if (drive.getStatus() == DriveStatus.CLOSED || drive.getStatus() == DriveStatus.COMPLETED) {
            throw new IllegalArgumentException("Cannot apply to a drive that is " + drive.getStatus());
        }

        if (drive.getDeadline() != null && LocalDateTime.now().isAfter(drive.getDeadline())) {
            throw new IllegalArgumentException("The application deadline for this drive has passed");
        }

        Long requestedStudentId = requestDto.getStudentProfileId();
        Long finalStudentId = (requestedStudentId != null) ? requestedStudentId :
                studentProfileRepository.findAll().stream()
                        .findFirst()
                        .map(StudentProfile::getId)
                        .orElseThrow(() -> new ResourceNotFoundException("No active student profile found"));

        StudentProfile student = studentProfileRepository.findById(finalStudentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found with id: " + finalStudentId));

        if (applicationRepository.existsByStudentProfileIdAndPlacementDriveId(student.getId(), drive.getId())) {
            throw new IllegalArgumentException("Student has already applied for this placement drive");
        }

        // Eligibility validation (CGPA check)
        if (drive.getMinCgpa() != null && student.getCgpa() != null && student.getCgpa() < drive.getMinCgpa()) {
            throw new IllegalArgumentException(
                String.format("Student CGPA (%.2f) does not meet minimum drive requirement (%.2f)", student.getCgpa(), drive.getMinCgpa())
            );
        }

        Application application = new Application();
        application.setStudentProfile(student);
        application.setPlacementDrive(drive);
        application.setAppliedAt(LocalDateTime.now());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setResumeUrl(requestDto.getResumeUrl() != null ? requestDto.getResumeUrl() : student.getResumeUrl());
        application.setCoverNote(requestDto.getCoverNote());

        Application saved = applicationRepository.save(application);
        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponseDto> getStudentApplications(Long studentProfileId) {
        return applicationRepository.findByStudentProfileIdOrderByAppliedAtDesc(studentProfileId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponseDto getApplicationById(Long applicationId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        return mapToDto(app);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponseDto> getApplicationsForDrive(Long driveId, ApplicationStatus status, String department, Double minCgpa) {
        if (!placementDriveRepository.existsById(driveId)) {
            throw new ResourceNotFoundException("Placement drive not found with id: " + driveId);
        }
        return applicationRepository.filterApplications(driveId, status, department, minCgpa)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ApplicationResponseDto> shortlistCandidates(BulkShortlistRequestDto shortlistDto) {
        List<ApplicationResponseDto> shortlisted = new ArrayList<>();
        for (Long appId : shortlistDto.getApplicationIds()) {
            Application app = applicationRepository.findById(appId)
                    .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + appId));
            
            app.setStatus(ApplicationStatus.SHORTLISTED);
            if (shortlistDto.getRemarks() != null && !shortlistDto.getRemarks().isBlank()) {
                app.setRemarks(shortlistDto.getRemarks());
            }
            shortlisted.add(mapToDto(applicationRepository.save(app)));
        }
        return shortlisted;
    }

    @Override
    public ApplicationResponseDto updateApplicationStatus(Long applicationId, ApplicationStatusUpdateRequestDto updateDto) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));
        
        app.setStatus(updateDto.getStatus());
        if (updateDto.getRemarks() != null) {
            app.setRemarks(updateDto.getRemarks());
        }
        return mapToDto(applicationRepository.save(app));
    }

    @Override
    public ApplicationResponseDto withdrawApplication(Long applicationId, Long studentProfileId) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (studentProfileId != null && !app.getStudentProfile().getId().equals(studentProfileId)) {
            throw new IllegalArgumentException("Unauthorized to withdraw this application");
        }

        if (app.getStatus() == ApplicationStatus.SELECTED || app.getStatus() == ApplicationStatus.REJECTED) {
            throw new IllegalArgumentException("Cannot withdraw application after final outcome selection/rejection");
        }

        app.setStatus(ApplicationStatus.WITHDRAWN);
        return mapToDto(applicationRepository.save(app));
    }

    @Override
    public ApplicationResponseDto updateSelectionStatus(Long applicationId, SelectionUpdateRequestDto selectionDto) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (selectionDto.getStatus() != ApplicationStatus.SELECTED && selectionDto.getStatus() != ApplicationStatus.REJECTED) {
            throw new IllegalArgumentException("Selection outcome must be either SELECTED or REJECTED");
        }

        app.setStatus(selectionDto.getStatus());
        if (selectionDto.getStatus() == ApplicationStatus.SELECTED) {
            app.setOfferedCtc(selectionDto.getOfferedCtc() != null ? selectionDto.getOfferedCtc() : app.getPlacementDrive().getCtc());
        }
        if (selectionDto.getSelectionRemarks() != null) {
            app.setSelectionRemarks(selectionDto.getSelectionRemarks());
        }

        return mapToDto(applicationRepository.save(app));
    }

    public ApplicationResponseDto mapToDto(Application app) {
        ApplicationResponseDto dto = new ApplicationResponseDto();
        dto.setId(app.getId());

        if (app.getStudentProfile() != null) {
            dto.setStudentProfileId(app.getStudentProfile().getId());
            if (app.getStudentProfile().getUser() != null) {
                dto.setStudentName(app.getStudentProfile().getUser().getFullName());
                dto.setStudentEmail(app.getStudentProfile().getUser().getEmail());
            }
            dto.setRollNumber(app.getStudentProfile().getRollNumber());
            dto.setDepartment(app.getStudentProfile().getDepartment());
            dto.setCgpa(app.getStudentProfile().getCgpa());
        }

        if (app.getPlacementDrive() != null) {
            dto.setPlacementDriveId(app.getPlacementDrive().getId());
            dto.setDriveTitle(app.getPlacementDrive().getTitle());
            dto.setJobRole(app.getPlacementDrive().getJobRole());
            dto.setDriveCtc(app.getPlacementDrive().getCtc());
            if (app.getPlacementDrive().getCompany() != null) {
                dto.setCompanyName(app.getPlacementDrive().getCompany().getCompanyName());
            }
        }

        dto.setAppliedAt(app.getAppliedAt());
        dto.setStatus(app.getStatus());
        dto.setResumeUrl(app.getResumeUrl());
        dto.setCoverNote(app.getCoverNote());
        dto.setRemarks(app.getRemarks());
        dto.setOfferedCtc(app.getOfferedCtc());
        dto.setSelectionRemarks(app.getSelectionRemarks());

        List<InterviewRound> rounds = interviewRoundRepository.findByApplicationIdOrderByRoundNumberAsc(app.getId());
        dto.setInterviewRoundsCount(rounds.size());
        dto.setInterviewRounds(rounds.stream().map(this::mapInterviewRoundToDto).collect(Collectors.toList()));

        return dto;
    }

    private InterviewRoundResponseDto mapInterviewRoundToDto(InterviewRound round) {
        InterviewRoundResponseDto rDto = new InterviewRoundResponseDto();
        rDto.setId(round.getId());
        rDto.setApplicationId(round.getApplication().getId());
        if (round.getApplication().getStudentProfile() != null && round.getApplication().getStudentProfile().getUser() != null) {
            rDto.setStudentName(round.getApplication().getStudentProfile().getUser().getFullName());
            rDto.setRollNumber(round.getApplication().getStudentProfile().getRollNumber());
        }
        if (round.getApplication().getPlacementDrive() != null) {
            rDto.setDriveTitle(round.getApplication().getPlacementDrive().getTitle());
            if (round.getApplication().getPlacementDrive().getCompany() != null) {
                rDto.setCompanyName(round.getApplication().getPlacementDrive().getCompany().getCompanyName());
            }
        }
        rDto.setRoundNumber(round.getRoundNumber());
        rDto.setRoundName(round.getRoundName());
        rDto.setScheduledDateTime(round.getScheduledDateTime());
        rDto.setMode(round.getMode());
        rDto.setVenueOrLink(round.getVenueOrLink());
        rDto.setInstructions(round.getInstructions());
        rDto.setStatus(round.getStatus());
        rDto.setInterviewerFeedback(round.getInterviewerFeedback());
        rDto.setScore(round.getScore());
        return rDto;
    }
}
