package com.monadent.infrastructure.mapper;

import com.monadent.contracts.branches.BranchResponse;
import com.monadent.contracts.branches.CreateBranchRequest;
import com.monadent.contracts.branches.UpdateBranchRequest;
import com.monadent.domain.models.entity.Branch;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface BranchMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Branch toBranch(CreateBranchRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateBranch(UpdateBranchRequest request, @MappingTarget Branch branch);

    @Mapping(target = "branchId", source = "id")
    BranchResponse toResponse(Branch branch);
}
