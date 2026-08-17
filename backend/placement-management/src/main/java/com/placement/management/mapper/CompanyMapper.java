package com.placement.management.mapper;

import com.placement.management.dto.CompanyRequest;
import com.placement.management.dto.CompanyResponse;
import com.placement.management.entity.Company;
import org.mapstruct.*;

/**
 * MapStruct mapper for converting between {@link Company} entity and its DTOs.
 *
 * <p>Uses {@code componentModel = "spring"} so MapStruct generates a Spring bean
 * that can be injected via {@code @Autowired} / constructor injection.
 *
 * @author Team — feature/company-drive
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface CompanyMapper {

    /**
     * Maps a {@link CompanyRequest} to a new {@link Company} entity.
     *
     * @param request the incoming request DTO
     * @return a new entity populated from the request
     */
    Company toEntity(CompanyRequest request);

    /**
     * Maps a {@link Company} entity to a {@link CompanyResponse} DTO.
     *
     * @param company the entity to map
     * @return response DTO
     */
    CompanyResponse toResponse(Company company);

    /**
     * Applies fields from a {@link CompanyRequest} onto an existing {@link Company} entity.
     * Null request fields are ignored (preserves existing values).
     *
     * @param request  the update request DTO
     * @param company  the target entity to update
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromRequest(CompanyRequest request, @MappingTarget Company company);
}
