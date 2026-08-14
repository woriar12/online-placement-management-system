package com.placement.management.repository;

import com.placement.management.entity.Application;
import com.placement.management.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    @Query("SELECT a FROM Application a WHERE " +
           "(:query IS NULL OR LOWER(a.student.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.student.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.drive.company.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(a.drive.jobTitle) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR a.status = :status)")
    Page<Application> searchApplications(@Param("query") String query, @Param("status") ApplicationStatus status, Pageable pageable);

    long countByStatus(ApplicationStatus status);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM Application a WHERE a.status = 'SELECTED'")
    long countDistinctSelectedStudents();

    List<Application> findTop5ByOrderByAppliedAtDesc();

    List<Application> findTop5ByStatusOrderByAppliedAtDesc(ApplicationStatus status);

    long countByDriveId(Long driveId);

    long countByDriveIdAndStatus(Long driveId, ApplicationStatus status);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM Application a WHERE a.student.branch = :branch AND a.status = 'SELECTED'")
    long countSelectedStudentsByBranch(@Param("branch") String branch);

    @Query("SELECT COUNT(DISTINCT a.student.id) FROM Application a WHERE a.student.graduationYear = :year AND a.status = 'SELECTED'")
    long countSelectedStudentsByYear(@Param("year") Integer year);
}
