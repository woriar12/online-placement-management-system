# System Architecture

## Overview

The Online Placement Management System is designed as a decoupled 2-tier web application:

- **Frontend**: Single Page Application (SPA) built with React + Vite. Communicates with backend using RESTful APIs.
- **Backend**: Spring Boot micro-monolith supplying JSON endpoints, secured with Spring Security and JWT.
- **Database**: MySQL relational database managed via Hibernate / Spring Data JPA.

## Security Architecture

```
[ Client (React) ] ──( HTTP + Bearer Token )──> [ JwtAuthenticationFilter ]
                                                          │
                                                [ SecurityContextHolder ]
                                                          │
                                                    [ Controllers ]
```
