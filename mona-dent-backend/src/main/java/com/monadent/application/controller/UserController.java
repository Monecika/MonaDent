package com.monadent.application.controller;

import com.monadent.application.port.UserManagement;
import com.monadent.application.security.AuthenticatedUserProvider;
import com.monadent.contracts.users.CreateUserRequest;
import com.monadent.contracts.users.DoctorResponse;
import com.monadent.contracts.users.UpdateMeRequest;
import com.monadent.contracts.users.UpdateUserRequest;
import com.monadent.contracts.users.UserResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private final UserManagement userManagement;
    private final AuthenticatedUserProvider authenticatedUserProvider;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(userManagement.getAllUsers());
    }

    @GetMapping("/doctors")
    @PreAuthorize("@appointmentAuthorization.canAccessBranch(#p0)")
    public ResponseEntity<List<DoctorResponse>> getDoctors(@RequestParam UUID branchId) {
        return ResponseEntity.ok(userManagement.getDoctors(branchId));
    }

    @PostMapping
    @PreAuthorize("@userAuthorization.canCreateUser(#p0)")
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserResponse user = userManagement.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("@userAuthorization.canUpdateUser(#p0, #p1)")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userManagement.updateUser(
                userId,
                request));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getMe() {
        return ResponseEntity.ok(userManagement.getMe(authenticatedUserProvider.requireEmail()));
    }

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateMe(@Valid @RequestBody UpdateMeRequest request) {
        return ResponseEntity.ok(userManagement.updateMe(
                authenticatedUserProvider.requireEmail(),
                request));
    }
}
