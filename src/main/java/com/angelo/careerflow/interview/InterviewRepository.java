package com.angelo.careerflow.interview;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, String> {
    List<Interview> findAllByApplication_Id(String applicationId);
    Optional<Interview> findByIdAndApplication_Id(String id, String applicationId);
}