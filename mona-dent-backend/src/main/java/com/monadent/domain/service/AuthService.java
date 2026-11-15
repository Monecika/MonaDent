package com.monadent.domain.service;

import com.monadent.application.port.AuthManagement;
import com.monadent.application.port.JwtTokenProvider;
import com.monadent.contracts.auth.AuthResponse;
import com.monadent.contracts.auth.LoginRequest;
import com.monadent.contracts.auth.UpdatePasswordRequest;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.User;
import com.monadent.domain.models.security.CustomUserDetails;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import com.monadent.shared.EmailUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthManagement {

    private final UserJpaRepository userJpaRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(EmailUtils.normalize(
                    request.getEmail()), request.getPassword()));
        } catch (BadCredentialsException | DisabledException | LockedException ex) {
            throw new BaseException(HttpStatus.UNAUTHORIZED.value(),
                                    ErrorCode.INVALID_CREDENTIALS);
        }

        return toAuthResponse((CustomUserDetails) authentication.getPrincipal());
    }

    @Override
    public void updatePassword(String email, UpdatePasswordRequest request) {
        User user = userJpaRepository.findByEmail(EmailUtils.normalize(email))
                                     .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                          ErrorCode.USER_NOT_FOUND));

        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(EmailUtils.normalize(email),
                                                                                       request.getCurrentPassword()));
        } catch (BadCredentialsException | DisabledException | LockedException ex) {
            throw new BaseException(HttpStatus.UNAUTHORIZED.value(),
                                    ErrorCode.CURRENT_PASSWORD_INCORRECT);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setMustChangePassword(false);
        userJpaRepository.save(user);
    }

    private AuthResponse toAuthResponse(CustomUserDetails userDetails) {
        String token = jwtTokenProvider.generateToken(userDetails);

        return new AuthResponse().accessToken(token)
                                 .userId(userDetails.getId())
                                 .email(userDetails.getEmail())
                                 .role(userDetails.getRole())
                                 .mustChangePassword(userDetails.isMustChangePassword());
    }

}
