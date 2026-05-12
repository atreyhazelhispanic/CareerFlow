package com.angelo.careerflow.interview;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Interviews", description = "Manage interviews for a job application")
@RestController
@RequestMapping("/api/applications/{applicationId}/interviews")
public class InterviewController {

    private final InterviewService interviewService;

    public InterviewController(InterviewService interviewService) {
        this.interviewService = interviewService;
    }

    @GetMapping
    public List<InterviewResponse> getInterviews(@PathVariable String applicationId) {
        return interviewService.getInterviews(applicationId);
    }

    @GetMapping("/{interviewId}")
    public InterviewResponse getInterview(
            @PathVariable String applicationId,
            @PathVariable String interviewId
    ) {
        return interviewService.getInterview(applicationId, interviewId);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public InterviewResponse createInterview(
            @PathVariable String applicationId,
            @Valid @RequestBody CreateInterviewRequest request
    ) {
        return interviewService.createInterview(applicationId, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{interviewId}")
    public void deleteInterview(
            @PathVariable String applicationId,
            @PathVariable String interviewId
    ) {
        interviewService.deleteInterview(applicationId, interviewId);
    }
}