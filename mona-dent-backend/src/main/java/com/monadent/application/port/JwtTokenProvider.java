package com.monadent.application.port;

import com.monadent.domain.models.security.CustomUserDetails;

public interface JwtTokenProvider {
    String generateToken(CustomUserDetails userDetails);
}
