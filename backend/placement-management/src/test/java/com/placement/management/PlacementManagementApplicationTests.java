package com.placement.management;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

/**
 * Basic Spring Context Load verification test.
 *
 * <p>Uses mock/disabled datasource configuration during base scaffold testing
 * so tests pass before local MySQL database instance is started.
 */
@SpringBootTest
@TestPropertySource(properties = {
    "spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=MySQL",
    "spring.datasource.driver-class-name=org.h2.Driver",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PlacementManagementApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext loads without error
    }

}
