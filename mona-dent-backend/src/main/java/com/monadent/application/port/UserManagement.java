package com.monadent.application.port;

import com.monadent.contracts.users.CreateUserRequest;
import com.monadent.contracts.users.DoctorResponse;
import com.monadent.contracts.users.UpdateMeRequest;
import com.monadent.contracts.users.UpdateUserRequest;
import com.monadent.contracts.users.UserResponse;

import java.util.List;
import java.util.UUID;

public interface UserManagement {
    List<UserResponse> getAllUsers();

    List<DoctorResponse> getDoctors(UUID branchId);

    UserResponse createUser(CreateUserRequest request);

    UserResponse updateUser(UUID userId, UpdateUserRequest request);

    UserResponse getMe(String email);

    UserResponse updateMe(String email, UpdateMeRequest request);
}
