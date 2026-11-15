package com.monadent.application.security;

import com.monadent.contracts.users.CreateUserRequest;
import com.monadent.contracts.users.UpdateUserRequest;
import com.monadent.domain.enums.Role;
import com.monadent.domain.models.entity.Branch;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import com.monadent.domain.models.entity.User;
import com.monadent.domain.models.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static com.monadent.contracts.users.Role.ADMIN;

@Component("userAuthorization")
@RequiredArgsConstructor
public class UserAuthorization {

    private final UserJpaRepository userJpaRepository;

    public boolean canCreateUser(CreateUserRequest request) {
        CustomUserDetails actor = currentUser();
        if (actor == null || request == null || request.getRole() == null) {
            return false;
        }
        List<UUID> branchIds = request.getBranchIds();
        Set<UUID> requestedBranchIds = branchIds == null ? Collections.emptySet() : new HashSet<>(branchIds);
        if (isAdmin(actor)) {
            return true;
        }
        return isManager(actor)
                && actor.getBranchIds().containsAll(requestedBranchIds)
                && request.getRole() != ADMIN;
    }

    @Transactional(readOnly = true)
    public boolean canUpdateUser(UUID userId, UpdateUserRequest request) {
        CustomUserDetails actor = currentUser();
        if (actor == null || userId == null || request == null || isSelf(actor, userId)) {
            return false;
        }
        if (isAdmin(actor)) {
            return true;
        }
        if (!isManager(actor)) {
            return false;
        }

        User target = userJpaRepository.findById(userId).orElse(null);
        if (target == null) {
            return false;
        }
        Set<UUID> targetBranchIds = target.getBranches().stream()
                .map(Branch::getId)
                .collect(Collectors.toSet());
        if (target.getRole() == Role.ADMIN
                || Collections.disjoint(actor.getBranchIds(), targetBranchIds)) {
            return false;
        }
        List<UUID> newBranchIds = request.getBranchIds();
        if (newBranchIds != null && !actor.getBranchIds().containsAll(new HashSet<>(newBranchIds))) {
            return false;
        }
        return request.getRole() != ADMIN;
    }

    private CustomUserDetails currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return null;
        }
        return userDetails;
    }

    private boolean isAdmin(CustomUserDetails user) {
        return user.getAuthorities().stream().anyMatch(authority -> Objects.equals(authority.getAuthority(),
                                                                                   "ROLE_ADMIN"));
    }

    private boolean isManager(CustomUserDetails user) {
        return user.getAuthorities().stream().anyMatch(authority -> Objects.equals(authority.getAuthority(),
                                                                                   "ROLE_MANAGER"));
    }

    private boolean isSelf(CustomUserDetails user, UUID userId) {
        return user.getId().equals(userId);
    }
}
