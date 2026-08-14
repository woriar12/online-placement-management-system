package com.placement.management.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateStudentDTO {
    private String name;
    private String rollNumber;
    private String email;
    private String branch;
    private Double cgpa;
    private Integer graduationYear;
    private String phoneNumber;
    private String password;
}
