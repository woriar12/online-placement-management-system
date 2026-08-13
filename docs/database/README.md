# Database Schema & ERD

## Relational Model Overview

Database: `placement_db`

### Planned Entities
- `users`: Core authentication entity (id, email, password, role, status)
- `students`: Student profile details (user_id, roll_number, name, branch, cgpa, resume_url)
- `companies`: Company profile details (user_id, company_name, website, contact_email)
- `placement_drives`: Drive listings (id, company_id, job_title, eligibility_cgpa, ctc, location, deadline)
- `applications`: Student drive applications (id, student_id, drive_id, status, applied_at)
- `interviews`: Interview rounds (id, application_id, round_name, scheduled_at, status)
