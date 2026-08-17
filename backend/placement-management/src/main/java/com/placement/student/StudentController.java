package com.placement.student;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    /**
     * GET /api/students/{id}
     * View student profile
     */
    @GetMapping("/{id}")
    public ResponseEntity<StudentDto> getProfile(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getProfile(id));
    }

    /**
     * POST /api/students
     * Create or update student profile
     */
    @PostMapping
    public ResponseEntity<StudentDto> saveProfile(@RequestBody StudentDto dto) {
        return ResponseEntity.ok(studentService.saveProfile(dto));
    }

    /**
     * PUT /api/students/{id}
     * Update specific student profile
     */
    @PutMapping("/{id}")
    public ResponseEntity<StudentDto> updateProfile(@PathVariable Long id,
                                                     @RequestBody StudentDto dto) {
        dto.setId(id);
        return ResponseEntity.ok(studentService.saveProfile(dto));
    }

    /**
     * POST /api/students/{id}/resume
     * Upload resume file — stored locally
     */
    @PostMapping("/{id}/resume")
    public ResponseEntity<StudentDto> uploadResume(@PathVariable Long id,
                                                    @RequestParam("file") MultipartFile file) {
        try {
            return ResponseEntity.ok(studentService.uploadResume(id, file));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * GET /api/students/{id}/drives
     * List eligible placement drives for this student
     * (stub — real implementation queries drives table against student CGPA/branch)
     */
    @GetMapping("/{id}/drives")
    public ResponseEntity<?> getEligibleDrives(@PathVariable Long id) {
        StudentDto student = studentService.getProfile(id);
        // TODO: inject DriveService and filter by student eligibility criteria
        return ResponseEntity.ok(java.util.List.of(
                java.util.Map.of(
                        "id", 1,
                        "company", "Google",
                        "role", "SDE Intern",
                        "deadline", "2025-09-30",
                        "minCgpa", 8.0,
                        "eligible", student.getCgpa() != null && student.getCgpa() >= 8.0
                ),
                java.util.Map.of(
                        "id", 2,
                        "company", "Infosys",
                        "role", "System Engineer",
                        "deadline", "2025-10-15",
                        "minCgpa", 6.5,
                        "eligible", student.getCgpa() != null && student.getCgpa() >= 6.5
                )
        ));
    }

    /**
     * GET /api/students/{id}/applications
     * View application status
     * (stub — real implementation queries applications table)
     */
    @GetMapping("/{id}/applications")
    public ResponseEntity<?> getApplicationStatus(@PathVariable Long id) {
        // TODO: inject ApplicationService
        return ResponseEntity.ok(java.util.List.of(
                java.util.Map.of(
                        "id", 1,
                        "driveTitle", "Google SDE Intern",
                        "company", "Google",
                        "status", "SHORTLISTED",
                        "appliedOn", "2025-08-01"
                ),
                java.util.Map.of(
                        "id", 2,
                        "driveTitle", "Infosys System Engineer",
                        "company", "Infosys",
                        "status", "PENDING",
                        "appliedOn", "2025-08-05"
                )
        ));
    }
}
