package com.placement.management.dto;

import com.placement.management.entity.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Lightweight user information embedded in {@link AuthResponse}.
 *
 * @author feature/auth
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDto {

    private Long id;
    private String name;
    private String email;
    private Role role;
}
