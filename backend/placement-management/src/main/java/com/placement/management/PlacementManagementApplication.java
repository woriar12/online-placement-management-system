package com.placement.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Entry point for the Online Placement Management System backend.
 *
 * <p>This application exposes a RESTful API consumed by the React frontend.
 * Authentication is handled via Spring Security + JWT.
 *
 * @author Team Leader
 * @version 0.0.1-SNAPSHOT
 */
@SpringBootApplication
public class PlacementManagementApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlacementManagementApplication.class, args);
    }

}
