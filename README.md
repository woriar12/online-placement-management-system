# Online Placement Management System

> Scalable, full-stack web application designed for campus placement management, connecting students, placement officers (admins), and recruiting companies into a unified digital workflow.

---

## Table of Contents
1. [Project Description](#project-description)
2. [Objectives](#objectives)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [How to Run Backend](#how-to-run-backend)
6. [How to Run Frontend](#how-to-run-frontend)
7. [Git Branching Strategy](#git-branching-strategy)
8. [Team Development Workflow](#team-development-workflow)

---

## 1. Project Title
**Online Placement Management System (OPMS)**

---

## 2. Project Description
The Online Placement Management System automates and streamlines the end-to-end placement process in educational institutions. It provides dedicated portals and dashboards for three primary user roles:
- **Students**: Create profiles, upload resumes, view eligible placement drives, apply for jobs, and track interview status.
- **Companies**: Register, post job openings/placement drives, review student applications, shortlist candidates, and schedule interview rounds.
- **Administrators (Placement Officers)**: Manage user approvals, oversee placement drives, generate analytics reports, and broadcast announcements.

---

## 3. Objectives
- **Centralization**: Provide a single source of truth for student records, company requirements, and application statuses.
- **Automation**: Automate eligibility filtering (e.g. CGPA thresholds, branch constraints) and application workflows.
- **Transparency**: Enable real-time status tracking for students and placement officers throughout the recruitment cycle.
- **Security & Scalability**: Implement industry-standard authentication (Spring Security + JWT), stateless session management, and clean multi-tier architecture.

---

## 4. Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (v18), Vite, React Router DOM (v6), Axios |
| **Backend** | Java 17, Spring Boot (v3.3), Spring Security, Spring Data JPA |
| **Database** | MySQL 8.0+ |
| **ORM** | Hibernate / Spring Data JPA |
| **Authentication** | Stateless JWT (JSON Web Tokens) with BCrypt hashing |
| **Build Tools** | Maven (Backend), npm (Frontend) |
| **Version Control** | Git + GitHub |

---

## 5. Project Structure

```
online-placement-management-system/
│
├── backend/
│   └── placement-management/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/
│       │   │   │   └── com/placement/management/
│       │   │   │       ├── config/         # CORS & Bean configurations
│       │   │   │       ├── security/       # Spring Security & JWT Filter/Util
│       │   │   │       ├── controller/     # REST Controllers
│       │   │   │       ├── service/        # Business Logic Layer
│       │   │   │       ├── repository/     # Spring Data JPA Repositories
│       │   │   │       ├── entity/         # JPA Entities
│       │   │   │       ├── dto/            # Data Transfer Objects
│       │   │   │       ├── exception/      # Global Exception Handler & Responses
│       │   │   │       ├── mapper/         # Entity <-> DTO Mappers
│       │   │   │       └── PlacementManagementApplication.java
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       │       └── java/com/placement/management/
│       ├── pom.xml
│       └── README.md
│
├── frontend/
│   └── placement-frontend/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── layouts/
│       │   ├── services/       # Axios API client setup
│       │   ├── hooks/          # Custom React hooks
│       │   ├── context/        # Auth Context provider
│       │   ├── utils/          # Constants and utilities
│       │   ├── App.jsx         # App routes & shell
│       │   ├── main.jsx        # React entry point
│       │   └── index.css
│       ├── package.json
│       ├── vite.config.js
│       └── README.md
│
├── docs/
│   ├── requirements/   # Detailed feature requirements
│   ├── architecture/   # System & security architecture diagrams
│   ├── database/       # ER diagrams and database schema docs
│   └── api/            # API endpoint specifications
│
├── pom.xml             # Root Aggregator POM
├── mvnw.cmd            # Windows Maven Wrapper
├── mvnw                # Linux/macOS Maven Wrapper
├── .gitignore
├── README.md
└── LICENSE
```

---

## 6. How to Run Backend

### Option A: From Root Directory (`online-placement-management-system`)
```powershell
# Using Maven Wrapper (no installation required)
.\mvnw.cmd clean test

# Or using installed Maven
mvn clean test
```

### Option B: From Backend Directory (`backend/placement-management`)
```powershell
cd backend/placement-management
mvn clean test
```

---

## 7. How to Run Frontend

### Prerequisites
- Node.js 18+
- npm (v9+)

### Steps
1. Navigate to frontend directory:
   ```bash
   cd frontend/placement-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment example:
   ```bash
   cp .env.example .env
   ```
4. Start development server:
   ```bash
   npm run dev
   ```
5. Frontend will start at: `http://localhost:5173`

---

## 8. Git Branching Strategy

```
main (Production Ready)
  ↑
develop (Integration Branch)
  ↑
  ├── feature/auth                  (Developer 1: Security & Auth Module)
  ├── feature/company-drive         (Developer 2: Company & Drives Module)
  ├── feature/application-interview (Developer 3: Applications & Interviews)
  ├── feature/student               (Developer 4: Student Portal Module)
  └── feature/admin                 (Developer 5 / TL: Admin Dashboard & Reports)
```

---

## 9. Team Development Workflow

1. **Single Git Repository**: Maintain ONLY ONE Git repository at the project root (`online-placement-management-system/`). Do NOT run `git init` inside `backend/` or `frontend/`.
2. **Never push directly to `main`**: All feature work must take place on allocated `feature/*` branches.
3. **Pull Requests**: Submit PRs targeting the `develop` branch.
4. **Environment Secrets**: Never commit real database passwords, JWT secrets, or private keys to version control.
