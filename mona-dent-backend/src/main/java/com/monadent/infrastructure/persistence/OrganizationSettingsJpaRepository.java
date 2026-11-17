package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.OrganizationSettings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface OrganizationSettingsJpaRepository extends JpaRepository<OrganizationSettings, UUID> {
}
