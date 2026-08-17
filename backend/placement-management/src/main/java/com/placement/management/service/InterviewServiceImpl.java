package com.placement.management.service;

import com.placement.management.dto.InterviewRoundResponseDto;
import com.placement.management.dto.InterviewScheduleRequestDto;
import com.placement.management.dto.InterviewStatusUpdateRequestDto;
import com.placement.management.entity.*;
import com.placement.management.exception.ResourceNotFoundException;
import com.placement.management.repository.ApplicationRepository;
import com.placement.management.repository.InterviewRoundRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class InterviewServiceImpl implements InterviewService {

    private final InterviewRoundRepository interviewRoundRepository;
    private final ApplicationRepository applicationRepository;

    public InterviewServiceImpl(
            InterviewRoundRepository interviewRoundRepository,
            ApplicationRepository applicationRepository) {
        this.interviewRoundRepository = interviewRoundRepository;
        this.applicationRepository = applicationRepository;
    }

    @Override
    public InterviewRoundResponseDto scheduleInterview(InterviewScheduleRequestDto scheduleDto) {
        Application application = applicationRepository.findById(scheduleDto.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + scheduleDto.getApplicationId()));

        if (application.getStatus() == ApplicationStatus.REJECTED || application.getStatus() == ApplicationStatus.WITHDRAWN) {
            throw new IllegalArgumentException("Cannot schedule interview for application with status: " + application.getStatus());
        }

        InterviewRound round = new InterviewRound();
        round.setApplication(application);
        round.setRoundNumber(scheduleDto.getRoundNumber());
        round.setRoundName(scheduleDto.getRoundName());
        round.setScheduledDateTime(scheduleDto.getScheduledDateTime());
        round.setMode(scheduleDto.getMode());
        round.setVenueOrLink(scheduleDto.getVenueOrLink());
        round.setInstructions(scheduleDto.getInstructions());
        round.setStatus(InterviewStatus.SCHEDULED);

        InterviewRound saved = interviewRoundRepository.save(round);

        // Update application status to INTERVIEW_SCHEDULED if not already
        if (application.getStatus() != ApplicationStatus.INTERVIEW_SCHEDULED) {
            application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
            applicationRepository.save(application);
        }

        return mapToDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewRoundResponseDto> getInterviewsForApplication(Long applicationId) {
        if (!applicationRepository.existsById(applicationId)) {
            throw new ResourceNotFoundException("Application not found with id: " + applicationId);
        }
        return interviewRoundRepository.findByApplicationIdOrderByRoundNumberAsc(applicationId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewRoundResponseDto> getInterviewsForDrive(Long driveId) {
        return interviewRoundRepository.findByPlacementDriveId(driveId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InterviewRoundResponseDto> getInterviewsForStudent(Long studentProfileId) {
        return interviewRoundRepository.findByStudentProfileId(studentProfileId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public InterviewRoundResponseDto updateInterviewStatus(Long interviewId, InterviewStatusUpdateRequestDto updateDto) {
        InterviewRound round = interviewRoundRepository.findById(interviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview round not found with id: " + interviewId));

        round.setStatus(updateDto.getStatus());
        if (updateDto.getInterviewerFeedback() != null) {
            round.setInterviewerFeedback(updateDto.getInterviewerFeedback());
        }
        if (updateDto.getScore() != null) {
            round.setScore(updateDto.getScore());
        }

        InterviewRound saved = interviewRoundRepository.save(round);

        // Transition Application status based on round outcome if failed
        if (updateDto.getStatus() == InterviewStatus.FAILED) {
            Application app = round.getApplication();
            app.setStatus(ApplicationStatus.REJECTED);
            app.setRemarks("Failed " + round.getRoundName() + " (Round " + round.getRoundNumber() + ")");
            applicationRepository.save(app);
        }

        return mapToDto(saved);
    }

    public InterviewRoundResponseDto mapToDto(InterviewRound round) {
        InterviewRoundResponseDto dto = new InterviewRoundResponseDto();
        dto.setId(round.getId());
        dto.setApplicationId(round.getApplication().getId());

        if (round.getApplication().getStudentProfile() != null) {
            dto.setRollNumber(round.getApplication().getStudentProfile().getRollNumber());
            if (round.getApplication().getStudentProfile().getUser() != null) {
                dto.setStudentName(round.getApplication().getStudentProfile().getUser().getFullName());
            }
        }

        if (round.getApplication().getPlacementDrive() != null) {
            dto.setDriveTitle(round.getApplication().getPlacementDrive().getTitle());
            if (round.getApplication().getPlacementDrive().getCompany() != null) {
                dto.setCompanyName(round.getApplication().getPlacementDrive().getCompany().getCompanyName());
            }
        }

        dto.setRoundNumber(round.getRoundNumber());
        dto.setRoundName(round.getRoundName());
        dto.setScheduledDateTime(round.getScheduledDateTime());
        dto.setMode(round.getMode());
        dto.setVenueOrLink(round.getVenueOrLink());
        dto.setInstructions(round.getInstructions());
        dto.setStatus(round.getStatus());
        dto.setInterviewerFeedback(round.getInterviewerFeedback());
        dto.setScore(round.getScore());

        return dto;
    }
}
