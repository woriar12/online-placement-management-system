package com.placement.management.entity;

/**
 * Roles available in the placement management system.
 *
 * <ul>
 *   <li>{@link #STUDENT} — final-year students who apply to drives</li>
 *   <li>{@link #ADMIN} — system administrator with full access</li>
 *   <li>{@link #PLACEMENT_OFFICER} — coordinates drives and manages company relations</li>
 * </ul>
 *
 * @author feature/auth
 */
public enum Role {
    STUDENT,
    ADMIN,
    PLACEMENT_OFFICER
}
