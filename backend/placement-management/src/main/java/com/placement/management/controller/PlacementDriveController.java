package com.placement.management.controller;

import com.placement.management.dto.PlacementDriveRequest;
import com.placement.management.dto.PlacementDriveResponse;
import com.placement.management.entity.DriveStatus;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.PlacementDriveService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for Placement Drive management.
 *
 * <p>Base path: {@code /drives} (prepended by server context-path {@code /api}).
 *
 * @author Team — feature/company-drive
 */
@RestController
@RequestMapping("/drives")
public class PlacementDriveController {

    private final PlacementDriveService driveService;

    public PlacementDriveController(PlacementDriveService driveService) {
        this.driveService = driveService;
    }

    /**
     * Create a new placement drive.
     * POST /api/drives
     */
    @PostMapping
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> create(
            @Valid @RequestBody PlacementDriveRequest request) {
        PlacementDriveResponse response = driveService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Placement drive created successfully"));
    }

    /**
     * Get all placement drives with optional status filter and pagination.
     * GET /api/drives?status=ACTIVE&page=0&size=10
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<PlacementDriveResponse>>> getAll(
            @RequestParam(required = false) DriveStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "desc"),
                sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);
        Page<PlacementDriveResponse> result = driveService.findAll(status, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Get a single placement drive by ID.
     * GET /api/drives/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> getById(@PathVariable Long id) {
        PlacementDriveResponse response = driveService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Get all drives for a specific company.
     * GET /api/drives/company/{companyId}
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<ApiResponse<Page<PlacementDriveResponse>>> getByCompany(
            @PathVariable Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PlacementDriveResponse> result = driveService.findByCompany(companyId, pageable);
        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Update an existing placement drive.
     * PUT /api/drives/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody PlacementDriveRequest request) {
        PlacementDriveResponse response = driveService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Placement drive updated successfully"));
    }

    /**
     * Close a placement drive (sets status to CLOSED).
     * PATCH /api/drives/{id}/close
     */
    @PatchMapping("/{id}/close")
    public ResponseEntity<ApiResponse<PlacementDriveResponse>> closeDrive(@PathVariable Long id) {
        PlacementDriveResponse response = driveService.closeDrive(id);
        return ResponseEntity.ok(ApiResponse.success(response, "Placement drive closed successfully"));
    }

    /**
     * Delete a placement drive.
     * DELETE /api/drives/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        driveService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Placement drive deleted successfully"));
    }
}
