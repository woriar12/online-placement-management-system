package com.placement.management.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration for the Placement Management API.
 *
 * <p>Allows the React frontend (running on a different port) to communicate
 * with this backend. Adjust {@code cors.allowed-origins} in
 * {@code application.properties} for each environment.
 *
 * @author Team Leader
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins:http://localhost:5173}")
    private String allowedOrigins;

    /**
     * Defines the CORS policy applied globally to all API endpoints.
     *
     * @return a {@link CorsConfigurationSource} registered for all paths
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ── Allowed Origins ──────────────────────────────────────────────
        // Configure per environment via 'cors.allowed-origins' property.
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));

        // ── Allowed HTTP Methods ─────────────────────────────────────────
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // ── Allowed Headers ──────────────────────────────────────────────
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "X-Requested-With",
                "Cache-Control"
        ));

        // ── Expose Authorization Header to the browser ───────────────────
        configuration.setExposedHeaders(List.of("Authorization"));

        // ── Allow credentials (cookies / Authorization header) ───────────
        configuration.setAllowCredentials(true);

        // ── Preflight cache duration (seconds) ───────────────────────────
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
