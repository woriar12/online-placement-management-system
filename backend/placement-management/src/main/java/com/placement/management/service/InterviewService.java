package com.placement.management.service;

import com.placement.management.dto.InterviewRoundResponseDto;
import com.placement.management.dto.InterviewScheduleRequestDto;
import com.placement.management.dto.InterviewStatusUpdateRequestDto;

import java.util.List;

public interface InterviewService {

    InterviewRoundResponseDto scheduleInterview(InterviewScheduleRequestDto scheduleDto);

    List<InterviewRoundResponseDto> getInterviewsForApplication(Long applicationId);

    List<InterviewRoundResponseDto> getInterviewsForDrive(Long driveId);

    List<InterviewRoundResponseDto> getInterviewsForStudent(Long studentProfileId);

    InterviewRoundResponseDto updateInterviewStatus(Long interviewId, InterviewStatusUpdateRequestDto updateDto);
}
