package com.monadent.application.port;

import com.monadent.contracts.branches.BranchResponse;
import com.monadent.contracts.branches.CreateBranchRequest;
import com.monadent.contracts.branches.UpdateBranchRequest;

import java.util.List;
import java.util.UUID;

public interface BranchManagement {
    List<BranchResponse> getAllBranches();

    BranchResponse createBranch(CreateBranchRequest request);

    BranchResponse updateBranch(UUID branchId, UpdateBranchRequest request);

    void deleteBranch(UUID branchId);

    List<BranchResponse> getAssignedBranches(String email);
}
