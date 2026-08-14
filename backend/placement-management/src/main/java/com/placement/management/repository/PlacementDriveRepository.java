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
 * @author Team — feature/company-drive
 */
@Repository
public interface PlacementDriveRepository extends JpaRepository<PlacementDrive, Long> {

    /**
     * Fetches paginated drives for a specific company.
     *
     * @param companyId the company's primary key
     * @param pageable  pagination/sorting parameters
     * @return page of drives belonging to the company
     */
    Page<PlacementDrive> findByCompanyId(Long companyId, Pageable pageable);

    /**
     * Fetches paginated drives filtered by status.
     *
     * @param status   drive lifecycle status
     * @param pageable pagination/sorting parameters
     * @return page of drives matching the status
     */
    Page<PlacementDrive> findByStatus(DriveStatus status, Pageable pageable);

    /**
     * Fetches all drives for a company with a specific status (non-paginated).
     *
     * @param companyId the company's primary key
     * @param status    drive status filter
     * @return list of matching drives
     */
    List<PlacementDrive> findByCompanyIdAndStatus(Long companyId, DriveStatus status);

    /**
     * Fetches paginated drives with optional status filter.
     * When {@code status} is null, all drives are returned.
     *
     * @param status   optional status filter (null = all statuses)
     * @param pageable pagination/sorting parameters
     * @return page of drives
     */
    @Query("SELECT d FROM PlacementDrive d WHERE (:status IS NULL OR d.status = :status) ORDER BY d.createdAt DESC")
    Page<PlacementDrive> findAllByStatusOptional(@Param("status") DriveStatus status, Pageable pageable);
}
