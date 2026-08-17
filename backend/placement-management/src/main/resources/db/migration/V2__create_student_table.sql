-- V2: Create Students Table
CREATE TABLE IF NOT EXISTS students (
    id                  BIGINT AUTO_INCREMENT PRIMARY KEY,

    -- Profile
    full_name           VARCHAR(255)    NOT NULL,
    email               VARCHAR(255)    NOT NULL UNIQUE,
    phone_number        VARCHAR(20),
    address             TEXT,
    linkedin_url        VARCHAR(500),
    github_url          VARCHAR(500),

    -- Academic
    college             VARCHAR(255),
    degree              VARCHAR(100),
    branch              VARCHAR(100),
    graduation_year     INT,
    cgpa                DECIMAL(4, 2),
    percentage          DECIMAL(5, 2),
    tenth_marks         VARCHAR(50),
    twelfth_marks       VARCHAR(50),

    -- Skills (comma-separated)
    skills              TEXT,

    -- Resume
    resume_path         VARCHAR(1000),
    resume_original_name VARCHAR(255),

    -- Certifications & Projects (JSON strings)
    certifications      TEXT,
    projects            TEXT,

    -- Timestamps
    created_at          DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
