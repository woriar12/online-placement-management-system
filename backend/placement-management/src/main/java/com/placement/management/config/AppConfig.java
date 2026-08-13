package com.placement.management.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Application-wide bean definitions.
 *
 * <p>Centralizes infrastructure beans such as {@link PasswordEncoder},
 * {@link UserDetailsService}, and {@link AuthenticationManager} to prevent
 * circular dependency issues in Spring Security configurations.
 *
 * @author Team Leader
 */
@Configuration
public class AppConfig {

    /**
     * UserDetailsService bean stub until authentication module is implemented.
     */
    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            throw new UsernameNotFoundException("UserDetailsService placeholder: User not found with username: " + username);
        };
    }

    /**
     * BCrypt password encoder used for hashing user passwords.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * Exposes the {@link AuthenticationManager} as a Spring bean.
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
