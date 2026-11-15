package com.monadent.infrastructure.security;

import com.monadent.application.advice.ApiSecurityErrorHandler;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.service.IpAddressService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

@RequiredArgsConstructor
@Slf4j
public class IpAllowlistFilter extends OncePerRequestFilter {

    private final IpAddressService ipAddressService;
    private final ApiSecurityErrorHandler errorHandler;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith(request.getContextPath() + "/api/");
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())
                    || isLoopbackAddress(request.getRemoteAddr())
                    || ipAddressService.isAllowed(request.getRemoteAddr())) {
                filterChain.doFilter(request, response);
                return;
        }

        log.warn("Blocked request from non-allowlisted IP {} for {}",
                request.getRemoteAddr(), request.getRequestURI());
        errorHandler.writeError(
                request,
                response,
                HttpStatus.FORBIDDEN,
                ErrorCode.IP_ADDRESS_NOT_ALLOWED);
    }

    private boolean isLoopbackAddress(String address) {
        try {
            return InetAddress.getByName(address).isLoopbackAddress();
        } catch (UnknownHostException exception) {
            return false;
        }
    }
}
