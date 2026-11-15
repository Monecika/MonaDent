package com.monadent.domain.service;

import com.monadent.application.port.BranchManagement;
import com.monadent.contracts.branches.BranchResponse;
import com.monadent.contracts.branches.CreateBranchRequest;
import com.monadent.contracts.branches.UpdateBranchRequest;
import com.monadent.domain.enums.Role;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.Branch;
import com.monadent.infrastructure.mapper.BranchMapper;
import com.monadent.infrastructure.persistence.AppointmentJpaRepository;
import com.monadent.infrastructure.persistence.BranchJpaRepository;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import com.monadent.infrastructure.persistence.VisitJpaRepository;
import com.monadent.shared.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class BranchService implements BranchManagement {

    private final BranchJpaRepository branchJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final AppointmentJpaRepository appointmentJpaRepository;
    private final VisitJpaRepository visitJpaRepository;
    private final BranchMapper branchMapper;

    @Transactional(readOnly = true)
    @Override
    public List<BranchResponse> getAllBranches() {
        return branchJpaRepository.findAll()
                                  .stream()
                                  .map(branchMapper::toResponse)
                                  .toList();
    }

    @Override
    public BranchResponse createBranch(CreateBranchRequest request) {
        return branchMapper.toResponse(branchJpaRepository.save(branchMapper.toBranch(request)));
    }

    @Override
    public BranchResponse updateBranch(UUID branchId, UpdateBranchRequest request) {
        Branch branch = branchJpaRepository.findById(branchId)
                                           .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                                ErrorCode.BRANCH_NOT_FOUND));
        if (request.getName() == null && request.getAddress() == null) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(),
                                    ErrorCode.INVALID_BRANCH_UPDATE);
        }
        branchMapper.updateBranch(request, branch);
        return branchMapper.toResponse(branchJpaRepository.save(branch));
    }

    @Override
    public void deleteBranch(UUID branchId) {
        Branch branch = branchJpaRepository.findById(branchId)
                                           .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                                ErrorCode.BRANCH_NOT_FOUND));

        if (appointmentJpaRepository.existsByBranchId(branchId) || visitJpaRepository.existsByBranchId(branchId)) {
            throw new BaseException(HttpStatus.CONFLICT.value(),
                                    ErrorCode.BRANCH_IN_USE);
        }

        var assignedUsers = userJpaRepository.findDistinctByBranches_Id(branchId);
        assignedUsers.forEach(user -> user.getBranches()
                                          .remove(branch));
        userJpaRepository.saveAll(assignedUsers);
        userJpaRepository.flush();
        branchJpaRepository.delete(branch);
    }

    @Transactional(readOnly = true)
    @Override
    public List<BranchResponse> getAssignedBranches(String email) {
        var user = userJpaRepository.findByEmail(EmailUtils.normalize(email))
                                    .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                         ErrorCode.USER_NOT_FOUND));

        if (user.getRole()
                .equals(Role.ADMIN)) {
            return getAllBranches();
        }

        return user.getBranches()
                   .stream()
                   .map(branchMapper::toResponse)
                   .sorted(Comparator.comparing(BranchResponse::getName))
                   .toList();
    }
}
