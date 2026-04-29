package com.parttimejob.parttimejob.controller.publicapi;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.JobCategoryResponse;
import com.parttimejob.parttimejob.entity.job.JobCategoryEntity;
import com.parttimejob.parttimejob.service.job.JobCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/job-categories")
@RequiredArgsConstructor
public class JobCategoryController {

    private final JobCategoryService jobCategoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<JobCategoryResponse>>> getAllActiveCategories() {
        List<JobCategoryResponse> result = jobCategoryService.getAllActiveCategories();

        return ResponseEntity.ok(ApiResponse.<List<JobCategoryResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get job categories successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<JobCategoryResponse>> getCategoryById(@PathVariable Integer categoryId) {
        JobCategoryResponse result = jobCategoryService.getCategoryById(categoryId);

        return ResponseEntity.ok(ApiResponse.<JobCategoryResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get job category detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}