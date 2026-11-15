package com.monadent.application.security;

import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.security.CustomUserDetails;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUserProvider {
    public String requireEmail() {
        return requireUserDetails().getEmail();
    }

    public CustomUserDetails requireUserDetails() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            throw new BaseException(
                    HttpStatus.UNAUTHORIZED.value(),
                    ErrorCode.AUTHENTICATION_REQUIRED);
        }

        if (userDetails.getEmail() == null || userDetails.getEmail().isBlank()) {
            throw new BaseException(
                    HttpStatus.UNAUTHORIZED.value(),
                    ErrorCode.AUTHENTICATION_REQUIRED);
        }
        return userDetails;
    }
}
