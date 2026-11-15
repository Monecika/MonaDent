package com.monadent.application.controller;

import com.monadent.application.security.AuthenticatedUserProvider;
import com.monadent.application.port.BranchManagement;
import com.monadent.contracts.branches.BranchResponse;
import com.monadent.contracts.branches.CreateBranchRequest;
import com.monadent.contracts.branches.UpdateBranchRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/branches")
public class BranchController {

    private final BranchManagement branchManagement;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BranchResponse>> getAllBranches() {
        return ResponseEntity.ok(branchManagement.getAllBranches());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BranchResponse> createBranch(@Valid @RequestBody CreateBranchRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(branchManagement.createBranch(request));
    }

    @PutMapping("/{branchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BranchResponse> updateBranch(
            @PathVariable UUID branchId,
            @Valid @RequestBody UpdateBranchRequest request) {
        return ResponseEntity.ok(branchManagement.updateBranch(branchId, request));
    }

    @DeleteMapping("/{branchId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteBranch(@PathVariable UUID branchId) {
        branchManagement.deleteBranch(branchId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/assigned")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<BranchResponse>> getAssignedBranches() {
        return ResponseEntity.ok(branchManagement.getAssignedBranches(authenticatedUserProvider.requireEmail()));
    }
}
