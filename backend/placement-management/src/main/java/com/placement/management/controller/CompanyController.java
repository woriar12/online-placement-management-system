package com.placement.management.controller;

import com.placement.management.dto.CompanyRequest;
import com.placement.management.dto.CompanyResponse;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for Company management.
 *
 * <p>Base path: {@code /companies} (prepended by server context-path {@code /api}).
 *
 * @author Team — feature/company-drive
 */
@RestController
@RequestMapping("/companies")
public class CompanyController {

    private final CompanyService companyService;

    public CompanyController(CompanyService companyService) {
        this.companyService = companyService;
    }

    /**
     * Create a new company.
     * POST /api/companies
     */
    @PostMapping
    public ResponseEntity<ApiResponse<CompanyResponse>> create(
            @Valid @RequestBody CompanyRequest request) {
        CompanyResponse response = companyService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Company created successfully"));
    }

    /**
     * Get all companies with optional name search and pagination.
     * GET /api/companies?search=&page=0&size=10&sort=name,asc
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<CompanyResponse>>> getAll(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name,asc") String[] sort) {

        Sort sortOrder = Sort.by(Sort.Direction.fromString(sort.length > 1 ? sort[1] : "asc"),
                sort[0]);
        Pageable pageable = PageRequest.of(page, size, sortOrder);

        Page<CompanyResponse> result = (search != null && !search.isBlank())
                ? companyService.search(search, pageable)
                : companyService.findAll(pageable);

        return ResponseEntity.ok(ApiResponse.success(result));
    }

    /**
     * Get a single company by ID.
     * GET /api/companies/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> getById(@PathVariable Long id) {
        CompanyResponse response = companyService.findById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    /**
     * Update an existing company.
     * PUT /api/companies/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CompanyResponse>> update(
            @PathVariable Long id,
            @Valid @RequestBody CompanyRequest request) {
        CompanyResponse response = companyService.update(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Company updated successfully"));
    }

    /**
     * Delete a company by ID.
     * DELETE /api/companies/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        companyService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Company deleted successfully"));
    }
}
