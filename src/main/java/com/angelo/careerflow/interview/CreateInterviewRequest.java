package com.angelo.careerflow.interview;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;

public record CreateInterviewRequest(
        @NotBlank String interviewType,
        LocalDateTime scheduledAt,
        List<String> interviewerNames,
        String topics,
        String outcome,
        String notes
) {
}