package com.placement.management.repository;

import com.placement.management.entity.Application;
import com.placement.management.entity.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    List<Application> findByStudentProfileIdOrderByAppliedAtDesc(Long studentProfileId);

    List<Application> findByPlacementDriveIdOrderByAppliedAtDesc(Long placementDriveId);

    List<Application> findByPlacementDriveIdAndStatus(Long placementDriveId, ApplicationStatus status);

    boolean existsByStudentProfileIdAndPlacementDriveId(Long studentProfileId, Long placementDriveId);

    Optional<Application> findByStudentProfileIdAndPlacementDriveId(Long studentProfileId, Long placementDriveId);

    @Query("SELECT a FROM Application a WHERE a.placementDrive.id = :driveId " +
           "AND (:status IS NULL OR a.status = :status) " +
           "AND (:department IS NULL OR LOWER(a.studentProfile.department) LIKE LOWER(CONCAT('%', :department, '%'))) " +
           "AND (:minCgpa IS NULL OR a.studentProfile.cgpa >= :minCgpa) " +
           "ORDER BY a.appliedAt DESC")
    List<Application> filterApplications(
            @Param("driveId") Long driveId,
            @Param("status") ApplicationStatus status,
            @Param("department") String department,
            @Param("minCgpa") Double minCgpa
    );

    long countByStatus(ApplicationStatus status);

    List<Application> findTop5ByOrderByAppliedAtDesc();

    List<Application> findTop5ByStatusOrderByAppliedAtDesc(ApplicationStatus status);
}
