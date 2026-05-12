package com.angelo.careerflow.note;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Notes", description = "Manage notes for a job application")
@RestController
@RequestMapping("/api/applications/{applicationId}/notes")
public class NoteController {

    private final NoteService noteService;

    public NoteController(NoteService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<NoteResponse> getNotes(@PathVariable String applicationId) {
        return noteService.getNotes(applicationId);
    }

    @GetMapping("/{noteId}")
    public NoteResponse getNote(
            @PathVariable String applicationId,
            @PathVariable String noteId
    ) {
        return noteService.getNote(applicationId, noteId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public NoteResponse createNote(
            @PathVariable String applicationId,
            @Valid @RequestBody CreateNoteRequest request
    ) {
        return noteService.createNote(applicationId, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{noteId}")
    public void deleteNote(
            @PathVariable String applicationId,
            @PathVariable String noteId
    ) {
        noteService.deleteNote(applicationId, noteId);
    }
}