package com.placement.management.repository;

import com.placement.management.entity.PasswordResetToken;
import com.placement.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * Spring Data JPA repository for {@link PasswordResetToken} entities.
 *
 * @author feature/auth
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Looks up a reset token by its UUID string value.
     *
     * @param token the UUID token string
     * @return an {@link Optional} containing the entity if found
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Deletes all existing (possibly expired) tokens for the given user
     * before issuing a new one.
     *
     * @param user the user whose tokens should be cleared
     */
    @Modifying
    @Transactional
    void deleteByUser(User user);
}
