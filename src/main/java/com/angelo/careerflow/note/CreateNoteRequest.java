package com.angelo.careerflow.note;

import jakarta.validation.constraints.NotBlank;

public record CreateNoteRequest(
        @NotBlank String content
) {
}