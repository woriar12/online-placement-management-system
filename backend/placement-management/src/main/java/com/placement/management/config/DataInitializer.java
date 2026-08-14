package com.placement.management.config;

import com.placement.management.entity.*;
import com.placement.management.entity.enums.*;
import com.placement.management.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            StudentRepository studentRepository,
            CompanyRepository companyRepository,
            PlacementDriveRepository driveRepository,
            ApplicationRepository applicationRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("Initializing sample dataset for Online Placement Management System...");

            // 1. Admin User
            User adminUser = User.builder()
                    .email("admin@placement.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .status(AccountStatus.APPROVED)
                    .build();
            userRepository.save(adminUser);

            // 2. Sample Companies
            User compUser1 = userRepository.save(User.builder().email("recruitment@google.com").password(passwordEncoder.encode("comp123")).role(Role.COMPANY).status(AccountStatus.APPROVED).build());
            Company company1 = companyRepository.save(Company.builder().user(compUser1).companyName("Google").industry("Technology / Cloud").website("https://google.com").contactEmail("recruitment@google.com").contactPhone("+1 650 253 0000").location("Mountain View, CA / Bangalore").approvalStatus(CompanyStatus.APPROVED).build());

            User compUser2 = userRepository.save(User.builder().email("careers@microsoft.com").password(passwordEncoder.encode("comp123")).role(Role.COMPANY).status(AccountStatus.APPROVED).build());
            Company company2 = companyRepository.save(Company.builder().user(compUser2).companyName("Microsoft").industry("Software / AI").website("https://microsoft.com").contactEmail("careers@microsoft.com").contactPhone("+1 425 882 8080").location("Redmond, WA / Hyderabad").approvalStatus(CompanyStatus.APPROVED).build());

            User compUser3 = userRepository.save(User.builder().email("jobs@amazon.com").password(passwordEncoder.encode("comp123")).role(Role.COMPANY).status(AccountStatus.APPROVED).build());
            Company company3 = companyRepository.save(Company.builder().user(compUser3).companyName("Amazon").industry("E-Commerce / Cloud").website("https://amazon.jobs").contactEmail("jobs@amazon.com").contactPhone("+1 206 266 1000").location("Seattle, WA / Bangalore").approvalStatus(CompanyStatus.APPROVED).build());

            User compUser4 = userRepository.save(User.builder().email("hr@tcs.com").password(passwordEncoder.encode("comp123")).role(Role.COMPANY).status(AccountStatus.APPROVED).build());
            Company company4 = companyRepository.save(Company.builder().user(compUser4).companyName("TCS").industry("IT Services / Consulting").website("https://tcs.com").contactEmail("hr@tcs.com").contactPhone("+91 22 6778 9999").location("Mumbai / Pune").approvalStatus(CompanyStatus.APPROVED).build());

            User compUser5 = userRepository.save(User.builder().email("campus@deloitte.com").password(passwordEncoder.encode("comp123")).role(Role.COMPANY).status(AccountStatus.PENDING).build());
            companyRepository.save(Company.builder().user(compUser5).companyName("Deloitte").industry("Financial Advisory & Tech").website("https://deloitte.com").contactEmail("campus@deloitte.com").contactPhone("+1 212 492 4000").location("New York / Hyderabad").approvalStatus(CompanyStatus.PENDING).build());

            // 3. Sample Students
            Student s1 = createStudent("st1@placement.com", "CS2026-001", "Aarav Sharma", "Computer Science", 8.9, 2026);
            Student s2 = createStudent("st2@placement.com", "CS2026-002", "Ananya Verma", "Computer Science", 9.4, 2026);
            Student s3 = createStudent("st3@placement.com", "IT2026-001", "Rohan Gupta", "Information Technology", 8.2, 2026);
            Student s4 = createStudent("st4@placement.com", "EC2026-001", "Priya Patel", "Electronics", 7.8, 2026);
            Student s5 = createStudent("st5@placement.com", "ME2026-001", "Vikram Singh", "Mechanical", 8.1, 2026);
            Student s6 = createStudent("st6@placement.com", "CS2025-003", "Kavya Reddy", "Computer Science", 9.1, 2025);

            // 4. Sample Placement Drives
            PlacementDrive d1 = driveRepository.save(PlacementDrive.builder().company(company1).jobTitle("Software Development Engineer (SDE-1)").description("Full-time SDE role focusing on distributed systems and cloud infrastructure.").eligibilityCgpa(8.0).ctc(28.5).location("Bangalore").status(DriveStatus.ACTIVE).driveDate(LocalDate.now().plusDays(10)).deadline(LocalDateTime.now().plusDays(5)).build());
            PlacementDrive d2 = driveRepository.save(PlacementDrive.builder().company(company2).jobTitle("Cloud Solutions Architect Associate").description("Drive customer transformation via Azure cloud solutions.").eligibilityCgpa(7.5).ctc(24.0).location("Hyderabad").status(DriveStatus.ACTIVE).driveDate(LocalDate.now().plusDays(15)).deadline(LocalDateTime.now().plusDays(7)).build());
            PlacementDrive d3 = driveRepository.save(PlacementDrive.builder().company(company3).jobTitle("Systems Analyst").description("Optimize AWS cloud logistics and ecommerce supply chains.").eligibilityCgpa(7.0).ctc(20.0).location("Bangalore").status(DriveStatus.COMPLETED).driveDate(LocalDate.now().minusDays(10)).deadline(LocalDateTime.now().minusDays(15)).build());
            PlacementDrive d4 = driveRepository.save(PlacementDrive.builder().company(company4).jobTitle("Graduate Engineer Trainee (GET)").description("Entry-level software engineering and IT consulting.").eligibilityCgpa(6.5).ctc(7.5).location("Pune").status(DriveStatus.UPCOMING).driveDate(LocalDate.now().plusDays(30)).deadline(LocalDateTime.now().plusDays(20)).build());

            // 5. Sample Applications
            applicationRepository.save(Application.builder().student(s1).drive(d1).status(ApplicationStatus.SELECTED).build());
            applicationRepository.save(Application.builder().student(s2).drive(d1).status(ApplicationStatus.SELECTED).build());
            applicationRepository.save(Application.builder().student(s3).drive(d2).status(ApplicationStatus.SHORTLISTED).build());
            applicationRepository.save(Application.builder().student(s4).drive(d2).status(ApplicationStatus.APPLIED).build());
            applicationRepository.save(Application.builder().student(s5).drive(d3).status(ApplicationStatus.REJECTED).build());
            applicationRepository.save(Application.builder().student(s6).drive(d3).status(ApplicationStatus.SELECTED).build());

            log.info("Data seeding completed successfully! Admin login: admin@placement.com / admin123");
        }
    }

    private Student createStudent(String email, String rollNo, String name, String branch, double cgpa, int year) {
        User u = userRepository.save(User.builder().email(email).password(passwordEncoder.encode("student123")).role(Role.STUDENT).status(AccountStatus.APPROVED).build());
        return studentRepository.save(Student.builder().user(u).rollNumber(rollNo).name(name).branch(branch).cgpa(cgpa).graduationYear(year).isEligible(true).phoneNumber("+91 9876543210").build());
    }
}
