package com.placement.management.service;

import com.placement.management.dto.*;

/**
 * Authentication service contract covering registration, login, token refresh,
 * forgot/reset password, change password, and logout.
 *
 * @author feature/auth
 */
public interface AuthService {

    /**
     * Registers a new user and returns JWT tokens.
     *
     * @param request registration payload
     * @return {@link AuthResponse} with access token, refresh token, and user info
     * @throws IllegalArgumentException if the email is already taken or ADMIN role is requested
     */
    AuthResponse register(RegisterRequest request);

    /**
     * Authenticates a user and returns JWT tokens.
     *
     * @param request login payload
     * @return {@link AuthResponse} with access token, refresh token, and user info
     */
    AuthResponse login(LoginRequest request);

    /**
     * Issues a new access token from a valid refresh token.
     *
     * @param request refresh-token payload
     * @return new {@link AuthResponse}
     */
    AuthResponse refreshToken(RefreshTokenRequest request);

    /**
     * Initiates the forgot-password flow: generates a reset token, stores it, and logs
     * the reset URL.
     * the reset URL (email delivery is handled by {@link EmailService}).
     *
     * @param request contains the user's email
     */
    void forgotPassword(ForgotPasswordRequest request);

    /**
     * Validates the password-reset token and updates the user's password.
     *
     * @param request contains the token and new password
     * @param request contains the token, new password, and confirmation
     */
    void resetPassword(ResetPasswordRequest request);

    /**
     * Changes the password for the currently authenticated user.
     *
     * @param email   the authenticated user's email
     * @param request contains current password and new password
     * @param email             the authenticated user's email
     * @param request           contains current password, new password, and confirmation
     */
    void changePassword(String email, ChangePasswordRequest request);

    /**
     * Logs out the user.
     * Logs out the user (client-side token invalidation; extend to a deny-list if needed).
     *
     * @param token the JWT access token to invalidate
     */
    void logout(String token);
}
