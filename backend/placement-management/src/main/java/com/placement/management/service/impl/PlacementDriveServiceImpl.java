package com.placement.management.service.impl;

import com.placement.management.dto.PlacementDriveRequest;
import com.placement.management.dto.PlacementDriveResponse;
import com.placement.management.entity.Company;
import com.placement.management.entity.DriveStatus;
import com.placement.management.entity.PlacementDrive;
import com.placement.management.exception.ResourceNotFoundException;
import com.placement.management.mapper.PlacementDriveMapper;
import com.placement.management.repository.CompanyRepository;
import com.placement.management.repository.PlacementDriveRepository;
import com.placement.management.service.PlacementDriveService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Default implementation of {@link PlacementDriveService}.
 *
 * @author Team — feature/company-drive
 */
@Service
@Transactional
public class PlacementDriveServiceImpl implements PlacementDriveService {

    private static final Logger log = LoggerFactory.getLogger(PlacementDriveServiceImpl.class);

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveMapper driveMapper;

    public PlacementDriveServiceImpl(PlacementDriveRepository driveRepository,
                                     CompanyRepository companyRepository,
                                     PlacementDriveMapper driveMapper) {
        this.driveRepository = driveRepository;
        this.companyRepository = companyRepository;
        this.driveMapper = driveMapper;
    }

    @Override
    public PlacementDriveResponse create(PlacementDriveRequest request) {
        log.debug("Creating placement drive for companyId={}", request.getCompanyId());

        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Company not found with id: " + request.getCompanyId()));

        PlacementDrive drive = driveMapper.toEntity(request);
        drive.setCompany(company);

        // Default to UPCOMING if not specified
        if (drive.getStatus() == null) {
            drive.setStatus(DriveStatus.UPCOMING);
        }

        PlacementDrive saved = driveRepository.save(drive);
        log.info("Created placement drive id={}, title={}", saved.getId(), saved.getTitle());
        return driveMapper.toResponse(saved);
    }

    @Override
    public PlacementDriveResponse update(Long id, PlacementDriveRequest request) {
        log.debug("Updating placement drive id={}", id);

        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Placement drive not found with id: " + id));

        // If company is changing, validate and set the new company
        if (request.getCompanyId() != null &&
                !request.getCompanyId().equals(drive.getCompany().getId())) {
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Company not found with id: " + request.getCompanyId()));
            drive.setCompany(company);
        }

        driveMapper.updateEntityFromRequest(request, drive);
        PlacementDrive saved = driveRepository.save(drive);
        log.info("Updated placement drive id={}", saved.getId());
        return driveMapper.toResponse(saved);
    }

    @Override
    public PlacementDriveResponse closeDrive(Long id) {
        log.debug("Closing placement drive id={}", id);

        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Placement drive not found with id: " + id));

        drive.setStatus(DriveStatus.CLOSED);
        PlacementDrive saved = driveRepository.save(drive);
        log.info("Closed placement drive id={}", id);
        return driveMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        log.debug("Deleting placement drive id={}", id);

        if (!driveRepository.existsById(id)) {
            throw new ResourceNotFoundException("Placement drive not found with id: " + id);
        }
        driveRepository.deleteById(id);
        log.info("Deleted placement drive id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public PlacementDriveResponse findById(Long id) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Placement drive not found with id: " + id));
        return driveMapper.toResponse(drive);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlacementDriveResponse> findAll(DriveStatus status, Pageable pageable) {
        return driveRepository.findAllByStatusOptional(status, pageable)
                .map(driveMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<PlacementDriveResponse> findByCompany(Long companyId, Pageable pageable) {
        // Validate company exists
        if (!companyRepository.existsById(companyId)) {
            throw new ResourceNotFoundException("Company not found with id: " + companyId);
        }
        return driveRepository.findByCompanyId(companyId, pageable)
                .map(driveMapper::toResponse);
    }
}
