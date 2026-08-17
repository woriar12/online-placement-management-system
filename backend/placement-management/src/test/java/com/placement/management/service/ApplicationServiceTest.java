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
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private PlacementDriveRepository placementDriveRepository;

    @Mock
    private InterviewRoundRepository interviewRoundRepository;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private StudentProfile studentProfile;
    private PlacementDrive drive;
    private Application application;

    @BeforeEach
    void setUp() {
        User user = new User(1L, "student1", "student1@test.com", "pass", "Student One", "1234567890", Role.ROLE_STUDENT);
        studentProfile = new StudentProfile(1L, user, "ROLL001", "CSE", 8.5, 2025, "https://resume.url", "Java");

        Company company = new Company(1L, "TestCorp", "Tech", "https://testcorp.com", "Location", "hr@test.com");
        drive = new PlacementDrive(1L, "SDE Role", company, "SDE-1", "Job desc", "Remote", 12.0, 7.5, "CSE", LocalDateTime.now().plusDays(10), LocalDateTime.now().plusDays(15), DriveStatus.ACTIVE);

        application = new Application(1L, studentProfile, drive, LocalDateTime.now(), ApplicationStatus.APPLIED, "https://resume.url", "Cover note", null, null, null);
    }

    @Test
    void applyForDrive_Success() {
        ApplicationRequestDto request = new ApplicationRequestDto(1L, 1L, "https://resume.url", "Cover note");

        when(placementDriveRepository.findById(1L)).thenReturn(Optional.of(drive));
        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(studentProfile));
        when(applicationRepository.existsByStudentProfileIdAndPlacementDriveId(1L, 1L)).thenReturn(false);
        when(applicationRepository.save(any(Application.class))).thenReturn(application);
        when(interviewRoundRepository.findByApplicationIdOrderByRoundNumberAsc(1L)).thenReturn(Collections.emptyList());

        ApplicationResponseDto response = applicationService.applyForDrive(request);

        assertNotNull(response);
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        assertEquals("SDE Role", response.getDriveTitle());
        assertEquals("Student One", response.getStudentName());
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    void applyForDrive_ThrowsException_WhenDuplicate() {
        ApplicationRequestDto request = new ApplicationRequestDto(1L, 1L, "https://resume.url", "Cover note");

        when(placementDriveRepository.findById(1L)).thenReturn(Optional.of(drive));
        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(studentProfile));
        when(applicationRepository.existsByStudentProfileIdAndPlacementDriveId(1L, 1L)).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> applicationService.applyForDrive(request));
    }

    @Test
    void applyForDrive_ThrowsException_WhenIneligibleCgpa() {
        studentProfile.setCgpa(6.0); // Drive min CGPA is 7.5
        ApplicationRequestDto request = new ApplicationRequestDto(1L, 1L, "https://resume.url", "Cover note");

        when(placementDriveRepository.findById(1L)).thenReturn(Optional.of(drive));
        when(studentProfileRepository.findById(1L)).thenReturn(Optional.of(studentProfile));

        assertThrows(IllegalArgumentException.class, () -> applicationService.applyForDrive(request));
    }

    @Test
    void shortlistCandidates_Success() {
        BulkShortlistRequestDto shortlistDto = new BulkShortlistRequestDto(List.of(1L), "Selected for next round");

        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(interviewRoundRepository.findByApplicationIdOrderByRoundNumberAsc(1L)).thenReturn(Collections.emptyList());

        List<ApplicationResponseDto> result = applicationService.shortlistCandidates(shortlistDto);

        assertEquals(1, result.size());
        assertEquals(ApplicationStatus.SHORTLISTED, result.get(0).getStatus());
        assertEquals("Selected for next round", result.get(0).getRemarks());
    }

    @Test
    void withdrawApplication_Success() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(interviewRoundRepository.findByApplicationIdOrderByRoundNumberAsc(1L)).thenReturn(Collections.emptyList());

        ApplicationResponseDto response = applicationService.withdrawApplication(1L, 1L);

        assertEquals(ApplicationStatus.WITHDRAWN, response.getStatus());
    }
}
