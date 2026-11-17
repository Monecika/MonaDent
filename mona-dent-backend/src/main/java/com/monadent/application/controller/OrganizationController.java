package com.monadent.application.controller;

import com.monadent.contracts.organization.OrganizationResponse;
import com.monadent.contracts.organization.UpdateOrganizationRequest;
import com.monadent.domain.service.OrganizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/organization")
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    public ResponseEntity<OrganizationResponse> get() {
        return ResponseEntity.ok(organizationService.get());
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrganizationResponse> update(
            @Valid @RequestBody UpdateOrganizationRequest request) {
        return ResponseEntity.ok(organizationService.update(request));
    }
}
