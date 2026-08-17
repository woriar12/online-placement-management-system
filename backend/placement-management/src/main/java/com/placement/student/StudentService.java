package com.placement.student;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;

    // ── Create or Update Profile ────────────────────────────────────────────
    public StudentDto saveProfile(StudentDto dto) {
        Student student;
        if (dto.getId() != null) {
            student = studentRepository.findById(dto.getId())
                    .orElseThrow(() -> new RuntimeException("Student not found with id: " + dto.getId()));
        } else {
            student = new Student();
        }

        student.setFullName(dto.getFullName());
        student.setEmail(dto.getEmail());
        student.setPhoneNumber(dto.getPhoneNumber());
        student.setAddress(dto.getAddress());
        student.setLinkedinUrl(dto.getLinkedinUrl());
        student.setGithubUrl(dto.getGithubUrl());

        // Academic
        student.setCollege(dto.getCollege());
        student.setDegree(dto.getDegree());
        student.setBranch(dto.getBranch());
        student.setGraduationYear(dto.getGraduationYear());
        student.setCgpa(dto.getCgpa());
        student.setPercentage(dto.getPercentage());
        student.setTenthMarks(dto.getTenthMarks());
        student.setTwelfthMarks(dto.getTwelfthMarks());

        // Skills
        if (dto.getSkills() != null) {
            student.setSkills(String.join(",", dto.getSkills()));
        }

        // Certifications & Projects (raw JSON strings)
        student.setCertifications(dto.getCertifications());
        student.setProjects(dto.getProjects());

        Student saved = studentRepository.save(student);
        return toDto(saved);
    }

    // ── Get Profile ─────────────────────────────────────────────────────────
    public StudentDto getProfile(Long id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return toDto(student);
    }

    // ── Upload Resume ────────────────────────────────────────────────────────
    public StudentDto uploadResume(Long id, MultipartFile file) throws IOException {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        String savedPath = fileStorageService.storeResume(id, file);
        student.setResumePath(savedPath);
        student.setResumeOriginalName(file.getOriginalFilename());

        Student saved = studentRepository.save(student);
        return toDto(saved);
    }

    // ── Entity → DTO ─────────────────────────────────────────────────────────
    private StudentDto toDto(Student s) {
        List<String> skills = (s.getSkills() != null && !s.getSkills().isBlank())
                ? Arrays.stream(s.getSkills().split(","))
                        .map(String::trim)
                        .collect(Collectors.toList())
                : List.of();

        return StudentDto.builder()
                .id(s.getId())
                .fullName(s.getFullName())
                .email(s.getEmail())
                .phoneNumber(s.getPhoneNumber())
                .address(s.getAddress())
                .linkedinUrl(s.getLinkedinUrl())
                .githubUrl(s.getGithubUrl())
                .college(s.getCollege())
                .degree(s.getDegree())
                .branch(s.getBranch())
                .graduationYear(s.getGraduationYear())
                .cgpa(s.getCgpa())
                .percentage(s.getPercentage())
                .tenthMarks(s.getTenthMarks())
                .twelfthMarks(s.getTwelfthMarks())
                .skills(skills)
                .resumeOriginalName(s.getResumeOriginalName())
                .resumePath(s.getResumePath())
                .certifications(s.getCertifications())
                .projects(s.getProjects())
                .build();
    }
}
