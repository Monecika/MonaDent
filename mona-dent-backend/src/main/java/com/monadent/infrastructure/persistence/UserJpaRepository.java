package com.monadent.infrastructure.persistence;

import com.monadent.domain.enums.Role;
import com.monadent.domain.enums.UserStatus;
import com.monadent.domain.models.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

public interface UserJpaRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsByPhone(String phone);

    boolean existsByPhoneAndIdNot(String phone, UUID userId);

    boolean existsByIdAndBranches_Id(UUID userId, UUID branchId);

    List<User> findDistinctByBranches_Id(UUID branchId);

    List<User> findByRoleAndStatus(Role role, UserStatus status);

    List<User> findDistinctByBranches_IdAndRoleAndStatus(UUID branchId, Role role, UserStatus status);

    List<User> findByIdNot(UUID userId);

    List<User> findDistinctByBranches_IdIn(Set<UUID> branchIds);

    List<User> findDistinctByBranches_IdInAndIdNot(Set<UUID> branchIds, UUID userId);
}
