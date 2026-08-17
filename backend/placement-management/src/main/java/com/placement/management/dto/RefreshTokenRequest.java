package com.placement.management.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Request payload for refreshing an access token using a refresh token.
 *
 * @author feature/auth
 */
public class RefreshTokenRequest {

    @NotBlank(message = "Refresh token is required")
    private String refreshToken;

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }
}
