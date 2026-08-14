package com.placement.management.entity;

/**
 * Represents the lifecycle status of a placement drive.
 *
 * @author Team — feature/company-drive
 */
public enum DriveStatus {

    /** Drive is scheduled but applications are not yet open. */
    UPCOMING,

    /** Drive is currently accepting applications. */
    ACTIVE,

    /** Drive has been closed; no further applications accepted. */
    CLOSED
}
