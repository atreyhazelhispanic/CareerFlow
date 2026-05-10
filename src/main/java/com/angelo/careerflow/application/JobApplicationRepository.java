package com.angelo.careerflow.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobApplicationRepository extends JpaRepository<JobApplication, String> {

    Page<JobApplication> findByUserId(String userId, Pageable pageable);

    Page<JobApplication> findByUserIdAndStatus(
            String userId,
            ApplicationStatus status,
            Pageable pageable
    );

    Page<JobApplication> findByUserIdAndCompanyContainingIgnoreCase(
            String userId,
            String company,
            Pageable pageable
    );

    Page<JobApplication> findByUserIdAndStatusAndCompanyContainingIgnoreCase(
            String userId,
            ApplicationStatus status,
            String company,
            Pageable pageable
    );
}