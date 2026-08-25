package com.parttimejob.parttimejob.controller.employer;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.JobApplicationResponse;  
import com.parttimejob.parttimejob.service.application.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/employer")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYER')")
public class EmployerApplicationController {

    private final JobApplicationService jobApplicationService;

    @GetMapping("/job-posts/{jobPostId}/applications")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getJobApplicants(@PathVariable Integer jobPostId) {
        List<JobApplicationResponse> result = jobApplicationService.getApplicationsByJobPost(jobPostId);

        return ResponseEntity.ok(ApiResponse.<List<JobApplicationResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get job applicants successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/job-posts/{jobPostId}/applications/count")
    public ResponseEntity<ApiResponse<Long>> getApplicationCountByJobPost(@PathVariable Integer jobPostId) {
        Long count = jobApplicationService.countApplicationsByJobPost(jobPostId);

        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get application count successfully")
                .result(count)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/stores/{storeId}/applications/count")
    public ResponseEntity<ApiResponse<Long>> getApplicationCountByStore(@PathVariable Integer storeId) {
        Long count = jobApplicationService.countApplicationsByStore(storeId);

        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get application count by store successfully")
                .result(count)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }


    @PatchMapping("/applications/{applicationId}/status")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> updateApplicationStatus(
            @PathVariable Integer applicationId,
            @RequestParam String status
    ) {
        JobApplicationResponse result = jobApplicationService.updateApplicationStatus(applicationId, status);

        return ResponseEntity.ok(ApiResponse.<JobApplicationResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Update application status successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}