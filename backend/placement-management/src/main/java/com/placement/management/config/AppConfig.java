package com.placement.management.config;

import com.placement.management.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Application-wide bean definitions.
 *
 * <p>Centralizes infrastructure beans such as {@link PasswordEncoder} and
 * {@link AuthenticationManager} to prevent circular dependency issues in
 * Spring Security configurations.
 *
 * <p>{@link CustomUserDetailsService} is a {@code @Service} and is auto-detected
 * by Spring; it no longer needs to be declared here.
 *
 * @author Team Leader
 */
@Configuration
public class AppConfig {

    /**
     * BCrypt password encoder used for hashing user passwords.
     * Strength factor 12 is a good balance between security and performance.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Exposes the {@link AuthenticationManager} as a Spring bean so it can be
     * injected into {@link com.placement.management.service.AuthServiceImpl}.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
