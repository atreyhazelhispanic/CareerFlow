package com.angelo.careerflow.note;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface NoteRepository extends JpaRepository<Note, String> {
    List<Note> findAllByApplication_Id(String applicationId);
    Optional<Note> findByIdAndApplication_Id(String id, String applicationId);
}