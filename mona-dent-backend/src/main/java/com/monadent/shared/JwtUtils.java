package com.monadent.shared;

import jakarta.servlet.http.HttpServletRequest;

public final class JwtUtils {

    private JwtUtils() {
    }

    public static String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
