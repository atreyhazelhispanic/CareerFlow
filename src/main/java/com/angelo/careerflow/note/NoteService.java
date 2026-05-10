package com.angelo.careerflow.note;

import com.angelo.careerflow.application.JobApplication;
import com.angelo.careerflow.application.JobApplicationService;
import com.angelo.careerflow.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class NoteService {

    private final NoteRepository noteRepository;
    private final JobApplicationService applicationService;

    public NoteService(
            NoteRepository noteRepository,
            JobApplicationService applicationService
    ) {
        this.noteRepository = noteRepository;
        this.applicationService = applicationService;
    }

    public NoteResponse createNote(String applicationId, CreateNoteRequest request) {
        JobApplication application = applicationService.getOwnedApplicationEntity(applicationId);
        Note note = new Note(application, request.content());
        return NoteResponse.from(noteRepository.save(note));
    }

    @Transactional(readOnly = true)
    public List<NoteResponse> getNotes(String applicationId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        return noteRepository.findAllByApplicationId(applicationId)
                .stream().map(NoteResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public NoteResponse getNote(String applicationId, String noteId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        return noteRepository.findByIdAndApplicationId(noteId, applicationId)
                .map(NoteResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
    }

    public void deleteNote(String applicationId, String noteId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        Note note = noteRepository.findByIdAndApplicationId(noteId, applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Note not found"));
        noteRepository.delete(note);
    }
}