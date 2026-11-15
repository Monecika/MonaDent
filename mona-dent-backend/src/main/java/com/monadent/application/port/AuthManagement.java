package com.monadent.application.port;

import com.monadent.contracts.auth.AuthResponse;
import com.monadent.contracts.auth.LoginRequest;
import com.monadent.contracts.auth.UpdatePasswordRequest;

public interface AuthManagement {
    AuthResponse login(LoginRequest request);

    void updatePassword(String email, UpdatePasswordRequest request);
}
