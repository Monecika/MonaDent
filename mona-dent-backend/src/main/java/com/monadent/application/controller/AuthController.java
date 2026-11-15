package com.monadent.application.controller;

import com.monadent.application.security.AuthenticatedUserProvider;
import com.monadent.application.port.AuthManagement;
import com.monadent.contracts.auth.AuthResponse;
import com.monadent.contracts.auth.LoginRequest;
import com.monadent.contracts.auth.UpdatePasswordRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

    private final AuthManagement authManagement;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(authManagement.login(loginRequest));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePassword(@Valid @RequestBody UpdatePasswordRequest request) {
        authManagement.updatePassword(authenticatedUserProvider.requireEmail(), request);
        return ResponseEntity.noContent().build();
    }
}
