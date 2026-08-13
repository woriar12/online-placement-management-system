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
    "spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration,org.springframework.boot.autoconfigure.orm.jpa.HibernateJpaAutoConfiguration"
})
class PlacementManagementApplicationTests {

    @Test
    void contextLoads() {
        // Verifies Spring ApplicationContext loads without error
    }

}
