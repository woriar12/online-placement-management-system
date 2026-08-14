package com.placement.management.security;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Binds JWT-related properties from {@code application.properties}
 * (prefix: {@code jwt}).
 *
 * <p>Example properties:
 * <pre>
 *   jwt.secret=...
 *   jwt.expiration.ms=86400000
 *   jwt.refresh.expiration.ms=604800000
 * </pre>
 *
 * @author Team Leader
 */
@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    /** Base64-encoded, 256-bit minimum secret key. Injected via environment variable. */
    private String secret;

    /** Access-token TTL in milliseconds (default: 1 day). */
    private long expirationMs = 86400000L;

    /** Refresh-token TTL in milliseconds (default: 7 days). */
    private long refreshExpirationMs = 604800000L;

    // ── Getters & Setters ────────────────────────────────────────────

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    public void setExpirationMs(long expirationMs) {
        this.expirationMs = expirationMs;
    }

    public long getRefreshExpirationMs() {
        return refreshExpirationMs;
    }

    public void setRefreshExpirationMs(long refreshExpirationMs) {
        this.refreshExpirationMs = refreshExpirationMs;
    }
}
