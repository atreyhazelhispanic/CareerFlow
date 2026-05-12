package com.angelo.careerflow.application;

import jakarta.validation.Valid;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.*;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Applications", description = "Manage job applications")
@RestController
@RequestMapping("/api/applications")
public class JobApplicationController {

    private final JobApplicationService applicationService;

    public JobApplicationController(JobApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public Page<JobApplicationResponse> getApplications(
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String company,
            @PageableDefault(
                    size = 20,
                    sort = "appliedDate",
                    direction = Sort.Direction.DESC
            ) Pageable pageable
    ) {
        return applicationService.getApplications(status, company, pageable);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public JobApplicationResponse createApplication(
            @Valid @RequestBody CreateApplicationRequest request
    ) {
        return applicationService.createApplication(request);
    }

    @GetMapping("/{id}")
    public JobApplicationResponse getApplication(@PathVariable String id) {
        return applicationService.getApplication(id);
    }

    @PutMapping("/{id}")
    public JobApplicationResponse updateApplication(
            @PathVariable String id,
            @Valid @RequestBody UpdateApplicationRequest request
    ) {
        return applicationService.updateApplication(id, request);
    }

    @ResponseStatus(HttpStatus.NO_CONTENT)
    @DeleteMapping("/{id}")
    public void deleteApplication(@PathVariable String id) {
        applicationService.deleteApplication(id);
    }
}