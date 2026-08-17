package com.placement.management.config;

import com.placement.management.entity.*;
import com.placement.management.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Seeds initial admin user and sample placement data.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final StudentProfileRepository studentProfileRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository placementDriveRepository;
    private final ApplicationRepository applicationRepository;
    private final InterviewRoundRepository interviewRoundRepository;

    public DataInitializer(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            StudentProfileRepository studentProfileRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository placementDriveRepository,
            ApplicationRepository applicationRepository,
            InterviewRoundRepository interviewRoundRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.studentProfileRepository = studentProfileRepository;
        this.companyRepository = companyRepository;
        this.placementDriveRepository = placementDriveRepository;
        this.applicationRepository = applicationRepository;
        this.interviewRoundRepository = interviewRoundRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail    = System.getenv().getOrDefault("ADMIN_EMAIL",    "admin@placement.com");
        String adminPassword = System.getenv().getOrDefault("ADMIN_PASSWORD", "Admin@1234");
        String adminName     = System.getenv().getOrDefault("ADMIN_NAME",     "System Administrator");

        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setRole(Role.ADMIN);
            admin.setEnabled(true);
            userRepository.save(admin);
            log.info("Default ADMIN account seeded: {}", adminEmail);
        }

        if (userRepository.count() > 1) {
            return; // Sample data already seeded
        }

        try {
            // Seed Sample Data
            User studentUser1 = userRepository.save(new User(null, "alex_johnson", "alex@university.edu", passwordEncoder.encode("password123"), "Alex Johnson", "+1234567890", Role.STUDENT));
            User studentUser2 = userRepository.save(new User(null, "priya_sharma", "priya@university.edu", passwordEncoder.encode("password123"), "Priya Sharma", "+1234567891", Role.STUDENT));
            User studentUser3 = userRepository.save(new User(null, "rahul_verma", "rahul@university.edu", passwordEncoder.encode("password123"), "Rahul Verma", "+1234567892", Role.STUDENT));

            StudentProfile s1 = studentProfileRepository.save(new StudentProfile(null, studentUser1, "2021CSE001", "Computer Science", 8.85, 2025, "https://example.com/resumes/alex.pdf", "Java, Spring Boot, React, SQL"));
            StudentProfile s2 = studentProfileRepository.save(new StudentProfile(null, studentUser2, "2021ECE045", "Electronics & Comm", 8.10, 2025, "https://example.com/resumes/priya.pdf", "Python, Embedded C, MATLAB, IoT"));
            StudentProfile s3 = studentProfileRepository.save(new StudentProfile(null, studentUser3, "2021IT089", "Information Tech", 7.45, 2025, "https://example.com/resumes/rahul.pdf", "JavaScript, Node.js, HTML/CSS, MySQL"));

            Company c1 = companyRepository.save(new Company(null, "TechCorp Global", "Information Technology", "https://techcorp.com", "Bangalore, India", "careers@techcorp.com"));
            Company c2 = companyRepository.save(new Company(null, "InnovateX Solutions", "Software & Cloud", "https://innovatex.io", "Hyderabad, India", "recruiting@innovatex.io"));

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

            Application app1 = new Application(null, s1, drive1, LocalDateTime.now().minusDays(3), ApplicationStatus.INTERVIEW_SCHEDULED, "https://example.com/resumes/alex.pdf", "Enthusiastic about backend system design and microservices.", "Shortlisted based on CGPA and technical projects.", null, null);
            Application app2 = new Application(null, s2, drive1, LocalDateTime.now().minusDays(2), ApplicationStatus.SHORTLISTED, "https://example.com/resumes/priya.pdf", "Passionate about full-stack development.", "Meets CGPA cut-off.", null, null);

            Application savedApp1 = applicationRepository.save(app1);
            applicationRepository.save(app2);

            InterviewRound round1 = new InterviewRound(
                    null, savedApp1, 1, "Technical Coding Assessment",
                    LocalDateTime.now().plusDays(2), InterviewMode.ONLINE,
                    "https://meet.google.com/abc-defg-hij", "Please have webcam on and IDE ready for live coding.",
                    InterviewStatus.SCHEDULED, null, null
            );

            interviewRoundRepository.save(round1);
            log.info("Sample OPMS seed data initialized successfully!");
        } catch (Exception e) {
            log.warn("Sample data initialization note: {}", e.getMessage());
        }
    }
}
