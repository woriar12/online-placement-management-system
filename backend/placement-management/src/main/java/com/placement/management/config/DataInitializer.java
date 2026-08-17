package com.placement.management.config;

import com.placement.management.entity.*;
import com.placement.management.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRoundRepository interviewRoundRepository;

    public DataInitializer(
            UserRepository userRepository,
            StudentProfileRepository studentProfileRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository placementDriveRepository,
            ApplicationRepository applicationRepository,
            InterviewRoundRepository interviewRoundRepository) {
        this.userRepository = userRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRoundRepository = interviewRoundRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; // Data already seeded
        }

        // 1. Create Users
        User studentUser1 = userRepository.save(new User(null, "alex_johnson", "alex@university.edu", "$2a$12$e.g.hashed", "Alex Johnson", "+1234567890", Role.ROLE_STUDENT));
        User studentUser2 = userRepository.save(new User(null, "priya_sharma", "priya@university.edu", "$2a$12$e.g.hashed", "Priya Sharma", "+1234567891", Role.ROLE_STUDENT));
        User studentUser3 = userRepository.save(new User(null, "rahul_verma", "rahul@university.edu", "$2a$12$e.g.hashed", "Rahul Verma", "+1234567892", Role.ROLE_STUDENT));
        User companyUser = userRepository.save(new User(null, "techcorp_hr", "hr@techcorp.com", "$2a$12$e.g.hashed", "TechCorp Recruiter", "+1234567893", Role.ROLE_COMPANY));
        User adminUser = userRepository.save(new User(null, "placement_officer", "admin@university.edu", "$2a$12$e.g.hashed", "Placement Director", "+1234567894", Role.ROLE_ADMIN));

        // 2. Create Student Profiles
        StudentProfile s1 = studentProfileRepository.save(new StudentProfile(null, studentUser1, "2021CSE001", "Computer Science", 8.85, 2025, "https://example.com/resumes/alex.pdf", "Java, Spring Boot, React, SQL"));
        StudentProfile s2 = studentProfileRepository.save(new StudentProfile(null, studentUser2, "2021ECE045", "Electronics & Comm", 8.10, 2025, "https://example.com/resumes/priya.pdf", "Python, Embedded C, MATLAB, IoT"));
        StudentProfile s3 = studentProfileRepository.save(new StudentProfile(null, studentUser3, "2021IT089", "Information Tech", 7.45, 2025, "https://example.com/resumes/rahul.pdf", "JavaScript, Node.js, HTML/CSS, MySQL"));

        // 3. Create Companies
        Company c1 = companyRepository.save(new Company(null, "TechCorp Global", "Information Technology", "https://techcorp.com", "Bangalore, India", "careers@techcorp.com"));
        Company c2 = companyRepository.save(new Company(null, "InnovateX Solutions", "Software & Cloud", "https://innovatex.io", "Hyderabad, India", "recruiting@innovatex.io"));
        Company c3 = companyRepository.save(new Company(null, "FinTech Dynamics", "Financial Services", "https://fintechdynamics.com", "Mumbai, India", "hr@fintechdynamics.com"));

        // 4. Create Placement Drives
        PlacementDrive drive1 = placementDriveRepository.save(new PlacementDrive(
                null, "Software Development Engineer - 2025", c1, "Software Development Engineer (SDE-1)",
                "Full-time role developing scalable microservices and web applications.", "Bangalore", 14.50, 7.50,
                "CSE,IT,ECE", LocalDateTime.now().plusDays(15), LocalDateTime.now().plusDays(25), DriveStatus.ACTIVE
        ));

        PlacementDrive drive2 = placementDriveRepository.save(new PlacementDrive(
                null, "Cloud Systems & DevOps Engineer", c2, "Cloud Operations Engineer",
                "Automate cloud deployments, CI/CD pipelines, and AWS infrastructure management.", "Hyderabad", 12.00, 7.00,
                "CSE,IT", LocalDateTime.now().plusDays(20), LocalDateTime.now().plusDays(30), DriveStatus.ACTIVE
        ));

        PlacementDrive drive3 = placementDriveRepository.save(new PlacementDrive(
                null, "Data Analyst & Business Intelligence", c3, "Data Analyst",
                "Analyze financial transaction patterns and construct real-time executive dashboards.", "Mumbai", 10.00, 6.50,
                "CSE,ECE,EEE,ME", LocalDateTime.now().plusDays(5), LocalDateTime.now().plusDays(12), DriveStatus.ACTIVE
        ));

        // 5. Create Applications
        Application app1 = new Application(null, s1, drive1, LocalDateTime.now().minusDays(3), ApplicationStatus.INTERVIEW_SCHEDULED, "https://example.com/resumes/alex.pdf", "Enthusiastic about backend system design and microservices.", "Shortlisted based on CGPA and technical projects.", null, null);
        Application app2 = new Application(null, s2, drive1, LocalDateTime.now().minusDays(2), ApplicationStatus.SHORTLISTED, "https://example.com/resumes/priya.pdf", "Passionate about full-stack development.", "Meets CGPA cut-off.", null, null);
        Application app3 = new Application(null, s3, drive2, LocalDateTime.now().minusDays(1), ApplicationStatus.APPLIED, "https://example.com/resumes/rahul.pdf", "Keen interest in DevOps and Docker containerization.", null, null, null);

        Application savedApp1 = applicationRepository.save(app1);
        Application savedApp2 = applicationRepository.save(app2);
        Application savedApp3 = applicationRepository.save(app3);

        // 6. Create Interview Rounds
        InterviewRound round1 = new InterviewRound(
                null, savedApp1, 1, "Technical Coding Assessment",
                LocalDateTime.now().plusDays(2), InterviewMode.ONLINE,
                "https://meet.google.com/abc-defg-hij", "Please have webcam on and IDE ready for live coding.",
                InterviewStatus.SCHEDULED, null, null
        );

        interviewRoundRepository.save(round1);

        System.out.println(">>> OPMS Sample Seed Data Initialized Successfully!");
    }
}
