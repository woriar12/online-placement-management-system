# Placement Management Backend Service

Java Spring Boot backend service for the Online Placement Management System.

## Architecture & Package Structure

```
com.placement.management
├── config/       # Global configuration (CORS, Beans, etc.)
├── security/     # Spring Security & JWT components
├── controller/   # REST Controllers
├── service/      # Service Layer (Business logic interface + implementation)
├── repository/   # Spring Data JPA repositories
├── entity/       # JPA Entities / Database tables
├── dto/          # Data Transfer Objects (Request/Response models)
├── exception/    # Custom exceptions & global handler
└── mapper/       # Object Mapping (Entity <-> DTO)
```

## Setup & Running

### Prerequisites
- JDK 17+
- Maven 3.8+
- MySQL 8.0+

### Database Configuration
Create a database in MySQL:
```sql
CREATE DATABASE placement_db;
```

Pass database credentials as environment variables or update local profile:
```bash
export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/placement_db
export SPRING_DATASOURCE_USERNAME=root
export SPRING_DATASOURCE_PASSWORD=yourpassword
export JWT_SECRET=your_super_secret_key_minimum_256_bits_long
```

### Build & Run
```bash
mvn clean package
mvn spring-boot:run
```
Service runs at: `http://localhost:8080/api`
