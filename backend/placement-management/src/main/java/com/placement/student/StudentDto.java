package com.placement.student;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentDto {

    private Long id;

    // Profile
    private String fullName;
    private String email;
    private String phoneNumber;
    private String address;
    private String linkedinUrl;
    private String githubUrl;

    // Academic
    private String college;
    private String degree;
    private String branch;
    private Integer graduationYear;
    private Double cgpa;
    private Double percentage;
    private String tenthMarks;
    private String twelfthMarks;

    // Skills
    private List<String> skills;

    // Resume
    private String resumeOriginalName;
    private String resumePath;

    // Certifications & Projects (as raw JSON strings from frontend)
    private String certifications;
    private String projects;
}
