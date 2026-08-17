package com.placement.management.security;

import com.placement.management.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Security configuration for Spring Security + JWT authentication.
 *
 * @author Team Leader / feature/auth
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;
    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final AuthEntryPointHandler authEntryPointHandler;
    private final AccessDeniedHandlerImpl accessDeniedHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthFilter,
            CorsConfigurationSource corsConfigurationSource,
            CustomUserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder,
            AuthEntryPointHandler authEntryPointHandler,
            AccessDeniedHandlerImpl accessDeniedHandler) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.authEntryPointHandler = authEntryPointHandler;
        this.accessDeniedHandler = accessDeniedHandler;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(authEntryPointHandler)
                        .accessDeniedHandler(accessDeniedHandler)
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/auth/**",
                                "/public/**",
                                "/applications/**",
                                "/interviews/**",
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/actuator/health"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
