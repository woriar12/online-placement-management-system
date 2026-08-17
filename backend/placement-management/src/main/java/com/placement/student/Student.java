package com.placement.student;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Profile
    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    private String phoneNumber;
    private String address;
    private String linkedinUrl;
    private String githubUrl;

    // Academic Details
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private Double cgpa;
    private Double percentage;
    private String tenthMarks;
    private String twelfthMarks;

    // Skills (stored as comma-separated string)
    @Column(columnDefinition = "TEXT")
    private String skills;

    // Resume
    private String resumePath;
    private String resumeOriginalName;

    // Certifications (JSON string)
    @Column(columnDefinition = "TEXT")
    private String certifications;

    // Projects (JSON string)
    @Column(columnDefinition = "TEXT")
    private String projects;

    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
