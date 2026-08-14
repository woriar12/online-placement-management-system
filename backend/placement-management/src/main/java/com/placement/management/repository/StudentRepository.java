package com.placement.management.repository;

import com.placement.management.entity.Student;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    @Query("SELECT s FROM Student s WHERE " +
           "(:query IS NULL OR LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.user.email) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:branch IS NULL OR LOWER(s.branch) = LOWER(:branch))")
    Page<Student> searchStudents(@Param("query") String query, @Param("branch") String branch, Pageable pageable);

    @Query("SELECT DISTINCT s.branch FROM Student s")
    List<String> findDistinctBranches();

    @Query("SELECT DISTINCT s.graduationYear FROM Student s WHERE s.graduationYear IS NOT NULL ORDER BY s.graduationYear DESC")
    List<Integer> findDistinctGraduationYears();

    long countByIsEligibleTrue();
}
