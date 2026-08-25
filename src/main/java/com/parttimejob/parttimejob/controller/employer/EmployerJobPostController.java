package com.parttimejob.parttimejob.controller.employer;

import com.parttimejob.parttimejob.dto.request.JobPostCreationRequest;
import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.JobPostResponse;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.employer.EmployerRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.service.application.JobApplicationService;
import com.parttimejob.parttimejob.service.job.JobPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/employer/job-posts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYER')")
public class EmployerJobPostController {

    private final JobPostService jobPostService;
    private final JobApplicationService jobApplicationService;
    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;

    @GetMapping("/by-store/{storeId}")
    public ResponseEntity<ApiResponse<List<JobPostResponse>>> getJobPostsByStoreId(@PathVariable Integer storeId) {
        List<JobPostResponse> result = jobPostService.getJobPostsByStoreId(storeId);

        return ResponseEntity.ok(ApiResponse.<List<JobPostResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000) 
                .message("Get job posts by store ID successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobPostResponse>>> getEmployerJobPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Integer employerId = getCurrentEmployerId();
        Page<JobPostResponse> result = jobPostService.getEmployerJobPosts(employerId, page, size);

        return ResponseEntity.ok(ApiResponse.<Page<JobPostResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get employer job posts successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{jobPostId}")
    public ResponseEntity<ApiResponse<JobPostResponse>> getJobPostDetail(@PathVariable Integer jobPostId) {
        JobPostResponse result = jobPostService.getJobPostById(jobPostId);

        return ResponseEntity.ok(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get employer job post detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<JobPostResponse>> createJobPost(@RequestBody JobPostCreationRequest request) {
        request.setEmployerId(getCurrentEmployer().getId());
        JobPostResponse result = jobPostService.createJobPost(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Create job post successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/{jobPostId}")
    public ResponseEntity<ApiResponse<JobPostResponse>> updateJobPost(
            @PathVariable Integer jobPostId,
            @RequestBody JobPostCreationRequest request
    ) {
        request.setEmployerId(getCurrentEmployer().getId());
        JobPostResponse result = jobPostService.updateJobPost(jobPostId, request);

        return ResponseEntity.ok(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Update job post successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PatchMapping("/{jobPostId}/activate")
    public ResponseEntity<ApiResponse<JobPostResponse>> activateJobPost(@PathVariable Integer jobPostId) {
        JobPostResponse result = jobPostService.activateJobPost(jobPostId);

        return ResponseEntity.ok(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Activate job post successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PatchMapping("/{jobPostId}/pause")
    public ResponseEntity<ApiResponse<JobPostResponse>> pauseJobPost(@PathVariable Integer jobPostId) {
        JobPostResponse result = jobPostService.pauseJobPost(jobPostId);

        return ResponseEntity.ok(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Pause job post successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PatchMapping("/{jobPostId}/close")
    public ResponseEntity<ApiResponse<JobPostResponse>> closeJobPost(@PathVariable Integer jobPostId) {
        JobPostResponse result = jobPostService.closeJobPost(jobPostId);

        return ResponseEntity.ok(ApiResponse.<JobPostResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Close job post successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> countEmployerJobPosts() {
        Integer employerId = getCurrentEmployerId();
        Long count = jobPostService.countJobPostsByEmployer(employerId);

        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Count employer job posts successfully")
                .result(count)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/applications/count")
    public ResponseEntity<ApiResponse<Long>> countApplicationsByEmployer() {
        Integer employerId = getCurrentEmployerId();
        Long count = jobApplicationService.countApplicationsByEmployer(employerId);

        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Count applications for employer successfully")
                .result(count)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    private EmployerEntity getCurrentEmployer() {
        Integer userId = getCurrentUserId();

        return employerRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYER_NOT_FOUND));
    }

    private Integer getCurrentEmployerId() {
        return getCurrentEmployer().getId();
    }

    private Integer getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return user.getId();
    }
}