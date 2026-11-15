package com.monadent.application.config;

import com.monadent.domain.enums.Role;
import com.monadent.domain.enums.UserStatus;
import com.monadent.domain.models.entity.User;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class InitialAdminSeeder implements ApplicationRunner {

    private static final String INITIAL_EMAIL = "admin@default.com";
    private static final String INITIAL_PASSWORD = "yourAdmin!";

    private final UserJpaRepository userJpaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        if (userJpaRepository.count() > 0) {
            return;
        }

        User initialAdmin = new User();
        initialAdmin.setName("Default");
        initialAdmin.setSurname("Administrator");
        initialAdmin.setEmail(INITIAL_EMAIL);
        initialAdmin.setPhone("0000000000");
        initialAdmin.setDateOfBirth(LocalDate.of(1990, 1, 1));
        initialAdmin.setRole(Role.ADMIN);
        initialAdmin.setStatus(UserStatus.ACTIVE);
        initialAdmin.setPasswordHash(passwordEncoder.encode(INITIAL_PASSWORD));
        initialAdmin.setMustChangePassword(true);
        userJpaRepository.save(initialAdmin);
    }
}
