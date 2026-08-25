package com.parttimejob.parttimejob.controller.admin;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.JobCategoryResponse;
import com.parttimejob.parttimejob.entity.job.JobCategoryEntity;
import com.parttimejob.parttimejob.service.job.JobCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/admin/job-categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminJobCategoryController {

    private final JobCategoryService jobCategoryService;

    @PostMapping
    public ResponseEntity<ApiResponse<JobCategoryResponse>> createCategory(@RequestBody JobCategoryEntity request) {
        JobCategoryResponse result = jobCategoryService.createCategory(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<JobCategoryResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Create job category successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<JobCategoryResponse>> updateCategory(
            @PathVariable Integer categoryId,
            @RequestBody JobCategoryEntity request
    ) {
        JobCategoryResponse result = jobCategoryService.updateCategory(categoryId, request);

        return ResponseEntity.ok(ApiResponse.<JobCategoryResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Update job category successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Integer categoryId) {
        jobCategoryService.deleteCategory(categoryId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Delete job category successfully")
                .result(null)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}