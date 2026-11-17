package com.monadent.domain.service;

import com.monadent.contracts.organization.OrganizationResponse;
import com.monadent.contracts.organization.UpdateOrganizationRequest;
import com.monadent.domain.models.entity.OrganizationSettings;
import com.monadent.infrastructure.persistence.OrganizationSettingsJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class OrganizationService {

    private final OrganizationSettingsJpaRepository repository;

    @Transactional(readOnly = true)
    public OrganizationResponse get() {
        return repository.findAll().stream().findFirst()
                .map(this::toResponse)
                .orElseThrow(() -> new IllegalStateException("Organization settings row is missing."));
    }

    public OrganizationResponse update(UpdateOrganizationRequest request) {
        String name = request.getName().trim();
        String idno = request.getIdno().trim();
        if (name.isBlank() || idno.isBlank()) {
            throw new IllegalArgumentException("Organization name and IDNO are required.");
        }

        OrganizationSettings settings = repository.findAll().stream().findFirst()
                .orElseGet(OrganizationSettings::new);
        settings.setName(name);
        settings.setIdno(idno);
        return toResponse(repository.save(settings));
    }

    private OrganizationResponse toResponse(OrganizationSettings settings) {
        return new OrganizationResponse()
                .organizationId(settings.getId())
                .name(settings.getName())
                .idno(settings.getIdno());
    }
}
