package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class BranchUserLookup {
    private final BranchJpaRepository branchJpaRepository;
    private final UserJpaRepository userJpaRepository;

    public <T> BranchUsers load(
            Collection<T> entities,
            Function<T, UUID> branchId,
            Function<T, UUID> userId) {
        Map<UUID, Branch> branches = branchJpaRepository.findAllById(
                        entities.stream().map(branchId).collect(Collectors.toSet()))
                .stream()
                .collect(Collectors.toMap(Branch::getId, Function.identity()));
        Map<UUID, User> users = userJpaRepository.findAllById(
                        entities.stream().map(userId).collect(Collectors.toSet()))
                .stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        return new BranchUsers(branches, users);
    }

    public record BranchUsers(Map<UUID, Branch> branches, Map<UUID, User> users) {
    }
}
