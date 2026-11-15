package com.monadent.domain.service;

import com.monadent.application.port.UserManagement;
import com.monadent.application.security.AuthenticatedUserProvider;
import com.monadent.contracts.users.CreateUserRequest;
import com.monadent.contracts.users.DoctorResponse;
import com.monadent.contracts.users.UpdateMeRequest;
import com.monadent.contracts.users.UpdateUserRequest;
import com.monadent.contracts.users.UserResponse;
import com.monadent.domain.enums.Role;
import com.monadent.domain.enums.UserStatus;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.User;
import com.monadent.infrastructure.mapper.UserMapper;
import com.monadent.infrastructure.persistence.BranchJpaRepository;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import com.monadent.shared.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserManagement {

    private final UserJpaRepository userJpaRepository;
    private final BranchJpaRepository branchJpaRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        var actor = authenticatedUserProvider.requireUserDetails();
        if (Role.valueOf(actor.getRole()) != Role.ADMIN && actor.getBranchIds().isEmpty()) {
            return List.of();
        }
        List<User> users = Role.valueOf(actor.getRole()) == Role.ADMIN
                ? userJpaRepository.findByIdNot(actor.getId())
                : userJpaRepository.findDistinctByBranches_IdInAndIdNot(actor.getBranchIds(), actor.getId());
        return users.stream().map(userMapper::toUserResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<DoctorResponse> getDoctors(UUID branchId) {
        return userJpaRepository.findDistinctByBranches_IdAndRoleAndStatus(
                        branchId,
                        Role.DOCTOR,
                        UserStatus.ACTIVE)
                .stream()
                .map(userMapper::toDoctorResponse)
                .toList();
    }

    @Override
    public UserResponse createUser(CreateUserRequest request) {
        Set<UUID> branchIds = request.getBranchIds() == null
                ? Set.of()
                : new LinkedHashSet<>(request.getBranchIds());
        Set<Branch> branches = branchIds.isEmpty() ? new LinkedHashSet<>() : getBranches(branchIds);

        String email = EmailUtils.normalize(request.getEmail());
        if (userJpaRepository.existsByEmail(email)) {
            throw new BaseException(
                    HttpStatus.CONFLICT.value(),
                    ErrorCode.USER_ALREADY_EXISTS);
        }
        String phone = request.getPhone().trim();
        ensurePhoneAvailable(phone, null);

        User user = userMapper.toUser(request);
        user.setBranches(branches);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setStatus(UserStatus.ACTIVE);
        return userMapper.toUserResponse(userJpaRepository.save(user));
    }

    @Override
    public UserResponse updateUser(UUID userId, UpdateUserRequest request) {
        User user = userJpaRepository.findById(userId)
                .orElseThrow(() -> new BaseException(
                        HttpStatus.NOT_FOUND.value(),
                        ErrorCode.USER_NOT_FOUND));

        if (request.getBranchIds() != null) {
            Set<UUID> branchIds = new LinkedHashSet<>(request.getBranchIds());
            Set<Branch> branches = branchIds.isEmpty()
                    ? new LinkedHashSet<>()
                    : getBranches(branchIds);
            user.setBranches(branches);
        }

        userMapper.updateUser(request, user);
        normalizeUserEmail(user);
        normalizeUserPhone(user);
        ensureEmailAvailable(user);
        ensurePhoneAvailable(user.getPhone(), user.getId());
        return userMapper.toUserResponse(userJpaRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMe(String email) {
        return userMapper.toUserResponse(findByEmail(email));
    }

    @Override
    public UserResponse updateMe(String email, UpdateMeRequest request) {
        if (request.getPreferredLanguage() != null
                && !Set.of("ro", "ru", "en").contains(request.getPreferredLanguage().getValue())) {
            throw new BaseException(
                    HttpStatus.BAD_REQUEST.value(),
                    ErrorCode.INVALID_PREFERRED_LANGUAGE);
        }

        User user = findByEmail(email);
        userMapper.updateMe(request, user);
        normalizeUserEmail(user);
        ensureEmailAvailable(user);
        return userMapper.toUserResponse(userJpaRepository.save(user));
    }

    private User findByEmail(String email) {
        return userJpaRepository.findByEmail(EmailUtils.normalize(email))
                .orElseThrow(() -> new BaseException(
                        HttpStatus.NOT_FOUND.value(),
                        ErrorCode.USER_NOT_FOUND));
    }

    private Set<Branch> getBranches(Set<UUID> branchIds) {
        if (branchIds == null || branchIds.isEmpty()) {
            throw new BaseException(
                    HttpStatus.BAD_REQUEST.value(),
                    ErrorCode.BRANCH_ASSIGNMENT_REQUIRED);
        }
        Set<Branch> branches = new LinkedHashSet<>(branchJpaRepository.findAllById(branchIds));
        if (branches.size() != branchIds.size()) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(), ErrorCode.SPECIFIED_BRANCH_NOT_FOUND);
        }
        return branches;
    }

    private void normalizeUserEmail(User user) {
        user.setEmail(EmailUtils.normalize(user.getEmail()));
    }

    private void normalizeUserPhone(User user) {
        if (user.getPhone() != null) {
            user.setPhone(user.getPhone().trim());
        }
    }

    private void ensureEmailAvailable(User user) {
        userJpaRepository.findByEmail(user.getEmail())
                .filter(existing -> !existing.getId().equals(user.getId()))
                .ifPresent(existing -> {
                    throw new BaseException(
                            HttpStatus.CONFLICT.value(),
                            ErrorCode.USER_ALREADY_EXISTS);
                });
    }

    private void ensurePhoneAvailable(String phone, UUID currentUserId) {
        boolean exists = currentUserId == null
                ? userJpaRepository.existsByPhone(phone)
                : userJpaRepository.existsByPhoneAndIdNot(phone, currentUserId);
        if (exists) {
            throw new BaseException(
                    HttpStatus.CONFLICT.value(),
                    ErrorCode.USER_PHONE_ALREADY_EXISTS);
        }
    }

}
