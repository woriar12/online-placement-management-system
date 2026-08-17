package com.placement.management.service;

/**
 * Stub email service interface for sending transactional emails.
 *
 * <p>Plug in a real implementation (e.g. JavaMailSender, SendGrid, AWS SES) by
 * creating a {@code @Service} class that implements this interface.
 *
 * @author feature/auth
 */
public interface EmailService {

    /**
     * Sends a password-reset email containing the reset link.
     *
     * @param toEmail    the recipient's email address
     * @param resetLink  the full reset URL (including the token)
     */
    void sendPasswordResetEmail(String toEmail, String resetLink);
}
