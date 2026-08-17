package com.placement.management.mapper;

import com.placement.management.dto.PlacementDriveRequest;
import com.placement.management.dto.PlacementDriveResponse;
import com.placement.management.entity.PlacementDrive;
import org.mapstruct.*;

/**
 * MapStruct mapper for converting between {@link PlacementDrive} and its DTOs.
 *
 * <p>The {@code company} relationship is managed manually in the service layer;
 * the mapper only handles the flat scalar fields plus the flattened company fields
 * on the response side.
 *
 * @author Team — feature/company-drive
 */
@Mapper(componentModel = "spring", nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
public interface PlacementDriveMapper {

    /**
     * Maps a {@link PlacementDriveRequest} to a new entity.
     * The {@code company} association is set manually in the service.
     *
     * @param request the incoming DTO
     * @return a new entity (without company set)
     */
    @Mapping(target = "company", ignore = true)
    PlacementDrive toEntity(PlacementDriveRequest request);

    /**
     * Maps a {@link PlacementDrive} entity to a response DTO.
     * Flattens the nested {@code company} fields.
     *
     * @param drive the entity to map
     * @return response DTO with company details inlined
     */
    @Mapping(source = "company.id",       target = "companyId")
    @Mapping(source = "company.name",     target = "companyName")
    @Mapping(source = "company.logoUrl",  target = "companyLogoUrl")
    @Mapping(source = "company.industry", target = "companyIndustry")
    PlacementDriveResponse toResponse(PlacementDrive drive);

    /**
     * Partially updates an existing entity from a request DTO.
     * Null fields in the request are ignored.
     *
     * @param request the update payload
     * @param drive   the entity to patch
     */
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "company", ignore = true)
    void updateEntityFromRequest(PlacementDriveRequest request, @MappingTarget PlacementDrive drive);
}
