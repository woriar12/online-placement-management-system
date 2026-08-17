package com.placement.management.repository;

import com.placement.management.entity.Company;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * JPA repository for {@link Company} entities.
 *
 * @author Team — feature/company-drive & feature/application-interview
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c WHERE c.name = :companyName OR c.email = :companyName")
    Optional<Company> findByCompanyName(@Param("companyName") String companyName);

    Optional<Company> findByName(String name);

    Page<Company> findByNameContainingIgnoreCase(String name, Pageable pageable);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}
