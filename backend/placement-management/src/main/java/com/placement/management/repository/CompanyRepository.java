package com.placement.management.repository;

import com.placement.management.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * JPA repository for {@link Company} entities.
 *
 * @author Team — feature/company-drive
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * Case-insensitive name search with pagination support.
     *
     * @param name     partial or full company name
     * @param pageable pagination and sorting parameters
     * @return page of matching companies
     */
    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);

    /**
     * Checks if a company with the given name already exists (for uniqueness validation).
     *
     * @param name company name to check
     * @return {@code true} if a company with that name exists
     */
    boolean existsByName(String name);

    /**
     * Checks if a company with the given name exists, excluding a specific company ID.
     * Used during update operations to allow keeping the same name.
     *
     * @param name company name to check
     * @param id   company ID to exclude from the check
     * @return {@code true} if another company has this name
     */
    boolean existsByNameAndIdNot(String name, Long id);
}
