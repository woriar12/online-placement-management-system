package com.placement.management.service;

import com.placement.management.dto.*;
import com.placement.management.entity.*;
import com.placement.management.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InterviewServiceTest {

    @Mock
    private InterviewRoundRepository interviewRoundRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private InterviewServiceImpl interviewService;

    private Application application;
    private InterviewRound interviewRound;

    @BeforeEach
    void setUp() {
        User user = new User(1L, "student1", "student1@test.com", "pass", "Student One", "1234567890", Role.ROLE_STUDENT);
        StudentProfile student = new StudentProfile(1L, user, "ROLL001", "CSE", 8.5, 2025, "https://resume.url", "Java");
        Company company = new Company(1L, "TestCorp", "Tech", "https://testcorp.com", "Location", "hr@test.com");
        PlacementDrive drive = new PlacementDrive(1L, "SDE Role", company, "SDE-1", "Job desc", "Remote", 12.0, 7.5, "CSE", LocalDateTime.now().plusDays(10), LocalDateTime.now().plusDays(15), DriveStatus.ACTIVE);

        application = new Application(1L, student, drive, LocalDateTime.now(), ApplicationStatus.SHORTLISTED, "https://resume.url", null, null, null, null);

        interviewRound = new InterviewRound(1L, application, 1, "Technical Round 1", LocalDateTime.now().plusDays(2), InterviewMode.ONLINE, "https://meet.link", "Be ready", InterviewStatus.SCHEDULED, null, null);
    }

    @Test
    void scheduleInterview_Success() {
        InterviewScheduleRequestDto request = new InterviewScheduleRequestDto();
        request.setApplicationId(1L);
        request.setRoundNumber(1);
        request.setRoundName("Technical Round 1");
        request.setScheduledDateTime(LocalDateTime.now().plusDays(2));
        request.setMode(InterviewMode.ONLINE);
        request.setVenueOrLink("https://meet.link");
        request.setInstructions("Be ready");

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(interviewRoundRepository.save(any(InterviewRound.class))).thenReturn(interviewRound);

        InterviewRoundResponseDto response = interviewService.scheduleInterview(request);

        assertNotNull(response);
        assertEquals("Technical Round 1", response.getRoundName());
        assertEquals(InterviewStatus.SCHEDULED, response.getStatus());
        verify(applicationRepository, times(1)).save(application);
        assertEquals(ApplicationStatus.INTERVIEW_SCHEDULED, application.getStatus());
    }

    @Test
    void updateInterviewStatus_Passed_Success() {
        InterviewStatusUpdateRequestDto updateDto = new InterviewStatusUpdateRequestDto(InterviewStatus.PASSED, "Great coding skills", 90.0);

        when(interviewRoundRepository.findById(1L)).thenReturn(Optional.of(interviewRound));
        when(interviewRoundRepository.save(any(InterviewRound.class))).thenAnswer(i -> i.getArgument(0));

        InterviewRoundResponseDto response = interviewService.updateInterviewStatus(1L, updateDto);

        assertEquals(InterviewStatus.PASSED, response.getStatus());
        assertEquals("Great coding skills", response.getInterviewerFeedback());
        assertEquals(90.0, response.getScore());
    }

    @Test
    void updateInterviewStatus_Failed_TransitionsApplicationToRejected() {
        InterviewStatusUpdateRequestDto updateDto = new InterviewStatusUpdateRequestDto(InterviewStatus.FAILED, "Did not pass live coding test", 40.0);

        when(interviewRoundRepository.findById(1L)).thenReturn(Optional.of(interviewRound));
        when(interviewRoundRepository.save(any(InterviewRound.class))).thenAnswer(i -> i.getArgument(0));

        InterviewRoundResponseDto response = interviewService.updateInterviewStatus(1L, updateDto);

        assertEquals(InterviewStatus.FAILED, response.getStatus());
        verify(applicationRepository, times(1)).save(application);
        assertEquals(ApplicationStatus.REJECTED, application.getStatus());
    }
}
