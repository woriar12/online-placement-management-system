package com.placement.management.service;

import com.placement.management.dto.CompanyRequest;
import com.placement.management.dto.CompanyResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service interface for {@link com.placement.management.entity.Company} business logic.
 *
 * @author Team — feature/company-drive
 */
public interface CompanyService {

    /**
     * Creates a new company.
     *
     * @param request the company details
     * @return the persisted company as a response DTO
     */
    CompanyResponse create(CompanyRequest request);

    /**
     * Updates an existing company by ID.
     *
     * @param id      the company's primary key
     * @param request the updated company details (null fields are ignored)
     * @return the updated company as a response DTO
     */
    CompanyResponse update(Long id, CompanyRequest request);

    /**
     * Deletes a company by ID.
     *
     * @param id the company's primary key
     */
    void delete(Long id);

    /**
     * Fetches a single company by ID.
     *
     * @param id the company's primary key
     * @return the company response DTO
     */
    CompanyResponse findById(Long id);

    /**
     * Returns a paginated list of all companies.
     *
     * @param pageable pagination and sorting parameters
     * @return page of company response DTOs
     */
    Page<CompanyResponse> findAll(Pageable pageable);

    /**
     * Searches companies by name (case-insensitive, partial match).
     *
     * @param name     the search term
     * @param pageable pagination and sorting parameters
     * @return page of matching company response DTOs
     */
    Page<CompanyResponse> search(String name, Pageable pageable);
}
