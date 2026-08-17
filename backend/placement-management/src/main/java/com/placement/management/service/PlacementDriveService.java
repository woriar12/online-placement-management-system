package com.placement.management.service;

import com.placement.management.dto.PlacementDriveRequest;
import com.placement.management.dto.PlacementDriveResponse;
import com.placement.management.entity.DriveStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for {@link com.placement.management.entity.PlacementDrive} business logic.
 *
 * @author Team — feature/company-drive
 */
public interface PlacementDriveService {

    /**
     * Creates a new placement drive.
     *
     * @param request the drive details (must include a valid companyId)
     * @return the persisted drive as a response DTO
     */
    PlacementDriveResponse create(PlacementDriveRequest request);

    /**
     * Updates an existing placement drive.
     *
     * @param id      the drive's primary key
     * @param request the updated drive details (null fields are ignored)
     * @return the updated drive as a response DTO
     */
    PlacementDriveResponse update(Long id, PlacementDriveRequest request);

    /**
     * Closes a drive by setting its status to {@link DriveStatus#CLOSED}.
     * The drive record is retained in the database.
     *
     * @param id the drive's primary key
     * @return the updated drive with CLOSED status
     */
    PlacementDriveResponse closeDrive(Long id);

    /**
     * Permanently deletes a drive by ID.
     *
     * @param id the drive's primary key
     */
    void delete(Long id);

    /**
     * Fetches a single drive by ID.
     *
     * @param id the drive's primary key
     * @return the drive response DTO
     */
    PlacementDriveResponse findById(Long id);

    /**
     * Returns a paginated list of drives, optionally filtered by status.
     *
     * @param status   optional status filter; null returns all drives
     * @param pageable pagination and sorting parameters
     * @return page of drive response DTOs
     */
    Page<PlacementDriveResponse> findAll(DriveStatus status, Pageable pageable);

    /**
     * Returns a paginated list of drives belonging to a specific company.
     *
     * @param companyId the company's primary key
     * @param pageable  pagination and sorting parameters
     * @return page of drive response DTOs for the company
     */
    Page<PlacementDriveResponse> findByCompany(Long companyId, Pageable pageable);
}
