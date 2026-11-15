package com.monadent.application.controller;

import com.monadent.contracts.ipaddresses.CreateIpAddressRequest;
import com.monadent.contracts.ipaddresses.IpAddressResponse;
import com.monadent.contracts.ipaddresses.UpdateIpAddressRequest;
import com.monadent.domain.service.IpAddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
@RequestMapping("/ip-addresses")
@PreAuthorize("hasRole('ADMIN')")
public class IpAddressController {

    private final IpAddressService ipAddressService;

    @GetMapping
    public ResponseEntity<List<IpAddressResponse>> getAll() {
        return ResponseEntity.ok(ipAddressService.getAll());
    }

    @PostMapping
    public ResponseEntity<IpAddressResponse> create(@Valid @RequestBody CreateIpAddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ipAddressService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<IpAddressResponse> updateName(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateIpAddressRequest request) {
        return ResponseEntity.ok(ipAddressService.updateName(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        ipAddressService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
