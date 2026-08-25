package com.parttimejob.parttimejob.controller.employer;

import com.parttimejob.parttimejob.dto.request.StoreCreationRequest;
import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.StoreResponse;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.employer.EmployerRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.service.job.StoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/employer/stores")
@RequiredArgsConstructor
@PreAuthorize("hasRole('EMPLOYER')")
public class StoreController {

    private final StoreService storeService;
    private final UserRepository userRepository;
    private final EmployerRepository employerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<List<StoreResponse>>> getMyStores() {
        Integer employerId = getCurrentEmployerId();
        List<StoreResponse> result = storeService.getStoresByEmployer(employerId);

        return ResponseEntity.ok(ApiResponse.<List<StoreResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get stores successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{storeId}")
    public ResponseEntity<ApiResponse<StoreResponse>> getStoreById(@PathVariable Integer storeId) {
        StoreResponse result = storeService.getStoreById(storeId);

        return ResponseEntity.ok(ApiResponse.<StoreResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get store detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<StoreResponse>> createStore(@RequestBody StoreCreationRequest request) {
        request.setEmployerId(getCurrentEmployer().getId());
        StoreResponse result = storeService.createStore(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<StoreResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Create store successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/{storeId}")
    public ResponseEntity<ApiResponse<StoreResponse>> updateStore(
            @PathVariable Integer storeId,
            @RequestBody StoreCreationRequest request
    ) {
        request.setEmployerId(getCurrentEmployer().getId());
        StoreResponse result = storeService.updateStore(storeId, request);

        return ResponseEntity.ok(ApiResponse.<StoreResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Update store successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PatchMapping("/{storeId}/toggle-active")
    public ResponseEntity<ApiResponse<Void>> toggleStoreActive(@PathVariable Integer storeId) {
        storeService.toggleStoreActive(storeId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Toggle store active successfully")
                .result(null)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> countMyStores() {
        Integer employerId = getCurrentEmployerId();
        Long count = storeService.countStoresByEmployer(employerId);

        return ResponseEntity.ok(ApiResponse.<Long>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Count stores successfully")
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