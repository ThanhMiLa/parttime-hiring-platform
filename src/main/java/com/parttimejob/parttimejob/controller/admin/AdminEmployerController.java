package com.parttimejob.parttimejob.controller.admin;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.EmployerResponse;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.service.employer.EmployerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;


@RestController
@RequestMapping("/api/admin/employers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminEmployerController {

    private final EmployerService employerService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EmployerResponse>>> getAllEmployers() {
        List<EmployerResponse> result = employerService.getAllEmployers();

        return ResponseEntity.ok(ApiResponse.<List<EmployerResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get employers successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{employerId}")
    public ResponseEntity<ApiResponse<EmployerResponse>> getEmployerById(@PathVariable Integer employerId) {
        EmployerResponse result = employerService.getEmployerById(employerId);

        return ResponseEntity.ok(ApiResponse.<EmployerResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get employer detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<EmployerResponse>> createEmployer(
            @RequestParam Integer userId,
            @RequestBody EmployerEntity request
    ) {
        EmployerResponse result = employerService.createEmployer(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<EmployerResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Create employer successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PatchMapping("/{employerId}/approve")
    public ResponseEntity<ApiResponse<EmployerResponse>> approveEmployer(@PathVariable Integer employerId) {
        EmployerResponse result = employerService.updateStatus(employerId, "ACTIVE");

        return ResponseEntity.ok(ApiResponse.<EmployerResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Approve employer successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PatchMapping("/{employerId}/suspend")
    public ResponseEntity<ApiResponse<EmployerResponse>> suspendEmployer(@PathVariable Integer employerId) {
        EmployerResponse result = employerService.updateStatus(employerId, "SUSPENDED");

        return ResponseEntity.ok(ApiResponse.<EmployerResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Suspend employer successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }


}