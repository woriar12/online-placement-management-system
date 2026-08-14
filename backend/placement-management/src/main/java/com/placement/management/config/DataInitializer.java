package com.placement.management.config;

import com.placement.management.entity.Role;
import com.placement.management.entity.User;
import com.placement.management.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Seeds an initial ADMIN account if none exists in the database.
 *
 * <p>Default admin credentials (change immediately in production):
 * <pre>
 *   Email    : admin@placement.com
 *   Password : Admin@1234
 * </pre>
 *
 * <p>Override defaults via environment variables:
 * <pre>
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 * </pre>
 *
 * @author feature/auth
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        String adminEmail    = System.getenv().getOrDefault("ADMIN_EMAIL",    "admin@placement.com");
        String adminPassword = System.getenv().getOrDefault("ADMIN_PASSWORD", "Admin@1234");
        String adminName     = System.getenv().getOrDefault("ADMIN_NAME",     "System Administrator");

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Default ADMIN account seeded: {}", adminEmail);
            log.warn("IMPORTANT: Change the default admin password before deploying to production!");
        } else {
            log.info("Admin account already exists — skipping seed.");
        }
    }
}
