package com.parttimejob.parttimejob.controller.user;

import com.parttimejob.parttimejob.dto.request.JobApplicationRequest;
import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.JobApplicationResponse;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.service.application.JobApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
@RequiredArgsConstructor
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> applyJob(
            @RequestBody JobApplicationRequest request
    ) {
        Integer userId = getCurrentUserId();
        JobApplicationResponse result = jobApplicationService.applyJob(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<JobApplicationResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Apply job successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<List<JobApplicationResponse>>> getMyApplications() {
        Integer userId = getCurrentUserId();
        List<JobApplicationResponse> result = jobApplicationService.getMyApplications(userId);

        return ResponseEntity.ok(ApiResponse.<List<JobApplicationResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get my job applications successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{applicationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<JobApplicationResponse>> getApplicationDetail(
            @PathVariable Integer applicationId
    ) {
        Integer userId = getCurrentUserId();
        JobApplicationResponse result = jobApplicationService.getApplicationDetail(userId, applicationId);

        return ResponseEntity.ok(ApiResponse.<JobApplicationResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get job application detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    private Integer getCurrentUserId() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        UserEntity user = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return user.getId();
    }
}