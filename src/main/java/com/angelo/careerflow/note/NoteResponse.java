package com.angelo.careerflow.note;

import java.time.Instant;

public record NoteResponse(
        String id,
        String applicationId,
        String content,
        Instant createdAt
) {
    public static NoteResponse from(Note note) {
        return new NoteResponse(
                note.getId(),
                note.getApplicationId(),
                note.getContent(),
                note.getCreatedAt()
        );
    }
}
