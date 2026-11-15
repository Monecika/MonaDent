package com.monadent.application.config;

import com.monadent.contracts.ipaddresses.CreateIpAddressRequest;
import com.monadent.domain.service.IpAddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class IpAddressAllowlistBootstrap implements ApplicationRunner {

    private final IpAddressService ipAddressService;

    @Value("${security.ip-allowlist.initial-ip:}")
    private String initialIp;

    @Value("${security.ip-allowlist.initial-name:Initial host}")
    private String initialName;

    @Override
    public void run(ApplicationArguments args) {
        if (!ipAddressService.isEmpty()) {
            return;
        }

        if (initialIp == null || initialIp.isBlank()) {
            log.warn("IP allowlist is empty. All API requests will be denied until an initial IP is configured.");
            return;
        }

        ipAddressService.create(new CreateIpAddressRequest(initialName, initialIp));
        log.info("Registered the configured initial IP address in the allowlist.");
    }
}
