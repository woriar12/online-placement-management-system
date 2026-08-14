package com.placement.management.repository;

import com.placement.management.entity.PlacementDrive;
import com.placement.management.entity.enums.DriveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {

    @Query("SELECT d FROM PlacementDrive d WHERE " +
           "(:query IS NULL OR LOWER(d.jobTitle) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(d.company.companyName) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR d.status = :status)")
    Page<PlacementDrive> searchDrives(@Param("query") String query, @Param("status") DriveStatus status, Pageable pageable);

    List<PlacementDrive> findTop5ByOrderByCreatedAtDesc();

    List<PlacementDrive> findTop5ByStatusOrderByDriveDateAsc(DriveStatus status);

    long countByStatus(DriveStatus status);
}
