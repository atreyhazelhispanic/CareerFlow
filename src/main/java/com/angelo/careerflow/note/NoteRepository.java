package com.angelo.careerflow.note;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, String> {
    List<Note> findAllByApplicationId(String applicationId);
    Optional<Note> findByIdAndApplicationId(String id, String applicationId);
}