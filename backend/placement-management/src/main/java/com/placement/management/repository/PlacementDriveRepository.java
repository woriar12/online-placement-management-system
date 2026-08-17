package com.placement.management.repository;

import com.placement.management.entity.DriveStatus;
import com.placement.management.entity.PlacementDrive;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA repository for {@link PlacementDrive} entities.
 *
 * @author Team — feature/company-drive & feature/application-interview
 */
@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {

    List<PlacementDrive> findByStatus(DriveStatus status);

    List<PlacementDrive> findByCompanyId(Long companyId);

    Page<PlacementDrive> findByCompanyId(Long companyId, Pageable pageable);

    Page<PlacementDrive> findByStatus(DriveStatus status, Pageable pageable);

    List<PlacementDrive> findByCompanyIdAndStatus(Long companyId, DriveStatus status);

    @Query("SELECT d FROM PlacementDrive d WHERE (:status IS NULL OR d.status = :status) ORDER BY d.createdAt DESC")
    Page<PlacementDrive> findAllByStatusOptional(@Param("status") DriveStatus status, Pageable pageable);
}
