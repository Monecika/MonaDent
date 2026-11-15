package com.monadent.infrastructure.mapper;

import com.monadent.contracts.branches.BranchResponse;
import com.monadent.contracts.branches.CreateBranchRequest;
import com.monadent.contracts.branches.UpdateBranchRequest;
import com.monadent.domain.models.entity.Branch;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-15T16:58:19+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class BranchMapperImpl implements BranchMapper {

    @Override
    public Branch toBranch(CreateBranchRequest request) {
        if ( request == null ) {
            return null;
        }

        Branch branch = new Branch();

        branch.setName( request.getName() );
        branch.setAddress( request.getAddress() );

        return branch;
    }

    @Override
    public void updateBranch(UpdateBranchRequest request, Branch branch) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            branch.setName( request.getName() );
        }
        if ( request.getAddress() != null ) {
            branch.setAddress( request.getAddress() );
        }
    }

    @Override
    public BranchResponse toResponse(Branch branch) {
        if ( branch == null ) {
            return null;
        }

        BranchResponse branchResponse = new BranchResponse();

        branchResponse.setBranchId( branch.getId() );
        branchResponse.setName( branch.getName() );
        branchResponse.setAddress( branch.getAddress() );

        return branchResponse;
    }
}
