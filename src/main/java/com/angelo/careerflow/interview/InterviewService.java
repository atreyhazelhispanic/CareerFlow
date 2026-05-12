package com.angelo.careerflow.interview;

import com.angelo.careerflow.application.JobApplication;
import com.angelo.careerflow.application.JobApplicationService;
import com.angelo.careerflow.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final JobApplicationService applicationService;

    public InterviewService(
            InterviewRepository interviewRepository,
            JobApplicationService applicationService
    ) {
        this.interviewRepository = interviewRepository;
        this.applicationService = applicationService;
    }

    public InterviewResponse createInterview(String applicationId, CreateInterviewRequest request) {
        JobApplication application = applicationService.getOwnedApplicationEntity(applicationId);
        Interview interview = new Interview(
                application,
                request.interviewType(),
                request.scheduledAt(),
                request.interviewerNames(),
                request.topics(),
                request.outcome(),
                request.notes()
        );
        return InterviewResponse.from(interviewRepository.save(interview));
    }

    @Transactional(readOnly = true)
    public List<InterviewResponse> getInterviews(String applicationId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        return interviewRepository.findAllByApplication_Id(applicationId)
                .stream().map(InterviewResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public InterviewResponse getInterview(String applicationId, String interviewId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        return interviewRepository.findByIdAndApplication_Id(interviewId, applicationId)
                .map(InterviewResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
    }

    public void deleteInterview(String applicationId, String interviewId) {
        applicationService.getOwnedApplicationEntity(applicationId);
        Interview interview = interviewRepository.findByIdAndApplication_Id(interviewId, applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        interviewRepository.delete(interview);
    }
}