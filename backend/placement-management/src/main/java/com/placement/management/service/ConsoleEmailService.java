package com.placement.management.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Console-logging implementation of {@link EmailService}.
 *
 * <p>Prints the reset link to the application log instead of sending a real email.
 * Replace with a proper SMTP/SendGrid/SES implementation before going to production.
 *
 * @author feature/auth
 */
@Service
public class ConsoleEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(ConsoleEmailService.class);

    @Override
    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        log.info("====================================================");
        log.info("  [DEV] Password Reset Email");
        log.info("  To: {}", toEmail);
        log.info("  Reset Link: {}", resetLink);
        log.info("====================================================");
    }
}
