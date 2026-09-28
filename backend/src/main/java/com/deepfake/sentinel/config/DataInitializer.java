package com.deepfake.sentinel.config;

import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.deepfake.sentinel.entity.Role;
import com.deepfake.sentinel.entity.User;
import com.deepfake.sentinel.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.default-username:admin}")
    private String adminUsername;

    @Value("${app.admin.default-email:admin@sentinel.ai}")
    private String adminEmail;

    @Value("${app.admin.default-password:change-this-password}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // Initialize default administrator
        if (!userRepository.existsByUsername(adminUsername)) {

            User admin = User.builder()
                    .username(adminUsername)
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .fullName("Sentinel Chief Administrator")
                    .role(Role.ROLE_ADMIN)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(admin);

            log.info("Initialized default ADMIN user: {}", adminUsername);
        }

        // Initialize default analyst
        if (!userRepository.existsByUsername("analyst")) {

            String analystPassword = System.getenv()
                    .getOrDefault("ANALYST_PASSWORD", "change-this-password");

            User analyst = User.builder()
                    .username("analyst")
                    .email("analyst@sentinel.ai")
                    .password(passwordEncoder.encode(analystPassword))
                    .fullName("Forensic Security Analyst")
                    .role(Role.ROLE_USER)
                    .enabled(true)
                    .createdAt(LocalDateTime.now())
                    .build();

            userRepository.save(analyst);

            log.info("Initialized default ANALYST user: analyst");
        }
    }
}