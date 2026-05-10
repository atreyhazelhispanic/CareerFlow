package com.angelo.careerflow.interview;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;

public record InterviewResponse(
        String id,
        String applicationId,
        String interviewType,
        LocalDateTime scheduledAt,
        List<String> interviewerNames,
        String topics,
        String outcome,
        String notes,
        Instant createdAt
) {
    public static InterviewResponse from(Interview interview) {
        return new InterviewResponse(
                interview.getId(),
                interview.getApplicationId(),
                interview.getInterviewType(),
                interview.getScheduledAt(),
                interview.getInterviewerNames(),
                interview.getTopics(),
                interview.getOutcome(),
                interview.getNotes(),
                interview.getCreatedAt()
        );
    }
}
