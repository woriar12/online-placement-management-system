package com.placement.management.repository;

import com.placement.management.entity.Company;
import com.placement.management.entity.enums.CompanyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    @Query("SELECT c FROM Company c WHERE " +
           "(:query IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.industry) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(c.contactEmail) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:status IS NULL OR c.approvalStatus = :status)")
    Page<Company> searchCompanies(@Param("query") String query, @Param("status") CompanyStatus status, Pageable pageable);

    long countByApprovalStatus(CompanyStatus status);
}
