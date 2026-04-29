package com.parttimejob.parttimejob.controller.publicapi;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.JobPostResponse;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import com.parttimejob.parttimejob.service.job.JobPostService;
import com.parttimejob.parttimejob.dto.request.JobSearchRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/job-posts")
@RequiredArgsConstructor
public class JobPostController {

    private final JobPostService jobPostService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobPostResponse>>> getHomeJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<JobPostResponse> result = jobPostService.getHomeJobs(page, size);

        return ResponseEntity.ok(ApiResponse.<Page<JobPostResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get job posts successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping("/search")
    public ResponseEntity<ApiResponse<Page<JobPostResponse>>> searchJobs(
            @RequestBody JobSearchRequest request,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size
    ) {
        Page<JobPostResponse> result = jobPostService.searchJobs(request, page, size);

        return ResponseEntity.ok(ApiResponse.<Page<JobPostResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Search job posts successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{jobPostId}")
    public ResponseEntity<ApiResponse<JobPostResponse>> getJobDetail(@PathVariable Integer jobPostId) {
        JobPostResponse result = jobPostService.getJobDetail(jobPostId);

        return ResponseEntity.ok(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get job post detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}