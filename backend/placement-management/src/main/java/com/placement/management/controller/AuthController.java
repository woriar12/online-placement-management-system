package com.placement.management.controller;

import com.placement.management.dto.*;
import com.placement.management.entity.User;
import com.placement.management.exception.ApiResponse;
import com.placement.management.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller that exposes all authentication-related endpoints.
 *
 * <p>Base path: {@code /api/auth}
 *
 * <pre>
 *   POST /auth/register         — public
 *   POST /auth/login            — public
 *   POST /auth/refresh          — public
 *   POST /auth/forgot-password  — public
 *   POST /auth/reset-password   — public
 *   POST /auth/logout           — authenticated
 *   POST /auth/change-password  — authenticated
 *   GET  /auth/me               — authenticated
 * </pre>
 *
 * @author feature/auth
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ── Public Endpoints ─────────────────────────────────────────────

    /**
     * Registers a new STUDENT or PLACEMENT_OFFICER account.
     * ADMIN self-registration is rejected.
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Registration successful"));
    }

    /**
     * Authenticates a user and returns JWT access + refresh tokens.
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    /**
     * Issues a new access token from a valid refresh token.
     */
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(
            @Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed"));
    }

    /**
     * Initiates the forgot-password flow (sends reset link via email/log).
     * Always returns 200 to prevent email enumeration.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(null,
                "If an account with that email exists, a reset link has been sent."));
    }

    /**
     * Validates the reset token and updates the user's password.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully"));
    }

    // ── Authenticated Endpoints ──────────────────────────────────────

    /**
     * Returns the authenticated user's profile information.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserInfoDto>> getCurrentUser(
            @AuthenticationPrincipal User user) {
        UserInfoDto dto = new UserInfoDto(
                user.getId(), user.getName(), user.getEmail(), user.getRole());
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    /**
     * Logs out the user (instructs client to discard tokens).
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        String token = (authHeader != null && authHeader.startsWith("Bearer "))
                ? authHeader.substring(7) : null;
        authService.logout(token);
        return ResponseEntity.ok(ApiResponse.success(null, "Logged out successfully"));
    }

    /**
     * Changes the authenticated user's password.
     */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(user.getEmail(), request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password changed successfully"));
    }
}
