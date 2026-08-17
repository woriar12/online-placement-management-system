package com.placement.management.repository;

import com.placement.management.entity.InterviewRound;
import com.placement.management.entity.InterviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRoundRepository extends JpaRepository<InterviewRound, Long> {

    List<InterviewRound> findByApplicationIdOrderByRoundNumberAsc(Long applicationId);

    @Query("SELECT r FROM InterviewRound r WHERE r.application.placementDrive.id = :driveId ORDER BY r.scheduledDateTime DESC")
    List<InterviewRound> findByPlacementDriveId(@Param("driveId") Long driveId);

    @Query("SELECT r FROM InterviewRound r WHERE r.application.studentProfile.id = :studentProfileId ORDER BY r.scheduledDateTime ASC")
    List<InterviewRound> findByStudentProfileId(@Param("studentProfileId") Long studentProfileId);

    List<InterviewRound> findByStatus(InterviewStatus status);
}
