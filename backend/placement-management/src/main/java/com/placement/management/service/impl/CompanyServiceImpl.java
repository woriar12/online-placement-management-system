package com.placement.management.service.impl;

import com.placement.management.dto.CompanyRequest;
import com.placement.management.dto.CompanyResponse;
import com.placement.management.entity.Company;
import com.placement.management.exception.ResourceNotFoundException;
import com.placement.management.mapper.CompanyMapper;
import com.placement.management.repository.CompanyRepository;
import com.placement.management.service.CompanyService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Default implementation of {@link CompanyService}.
 *
 * @author Team — feature/company-drive
 */
@Service
@Transactional
public class CompanyServiceImpl implements CompanyService {

    private static final Logger log = LoggerFactory.getLogger(CompanyServiceImpl.class);

    private final CompanyRepository companyRepository;
    private final CompanyMapper companyMapper;

    public CompanyServiceImpl(CompanyRepository companyRepository, CompanyMapper companyMapper) {
        this.companyRepository = companyRepository;
        this.companyMapper = companyMapper;
    }

    @Override
    public CompanyResponse create(CompanyRequest request) {
        log.debug("Creating company with name: {}", request.getName());

        if (companyRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException(
                    "A company with the name '" + request.getName() + "' already exists.");
        }

        Company company = companyMapper.toEntity(request);
        if (request.getActive() != null) {
            company.setActive(request.getActive());
        }

        Company saved = companyRepository.save(company);
        log.info("Created company with id={}, name={}", saved.getId(), saved.getName());
        return companyMapper.toResponse(saved);
    }

    @Override
    public CompanyResponse update(Long id, CompanyRequest request) {
        log.debug("Updating company id={}", id);

        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));

        // Check uniqueness only if name is actually changing
        if (request.getName() != null && !request.getName().equals(company.getName())) {
            if (companyRepository.existsByNameAndIdNot(request.getName(), id)) {
                throw new IllegalArgumentException(
                        "A company with the name '" + request.getName() + "' already exists.");
            }
        }

        companyMapper.updateEntityFromRequest(request, company);
        if (request.getActive() != null) {
            company.setActive(request.getActive());
        }

        Company saved = companyRepository.save(company);
        log.info("Updated company id={}", saved.getId());
        return companyMapper.toResponse(saved);
    }

    @Override
    public void delete(Long id) {
        log.debug("Deleting company id={}", id);

        if (!companyRepository.existsById(id)) {
            throw new ResourceNotFoundException("Company not found with id: " + id);
        }
        companyRepository.deleteById(id);
        log.info("Deleted company id={}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public CompanyResponse findById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return companyMapper.toResponse(company);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> findAll(Pageable pageable) {
        return companyRepository.findAll(pageable)
                .map(companyMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CompanyResponse> search(String name, Pageable pageable) {
        return companyRepository.findByNameContainingIgnoreCase(name, pageable)
                .map(companyMapper::toResponse);
    }
}
