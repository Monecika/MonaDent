package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface BranchJpaRepository extends JpaRepository<Branch, UUID> {
}
