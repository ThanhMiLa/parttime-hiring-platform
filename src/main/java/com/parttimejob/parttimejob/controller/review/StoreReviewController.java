package com.parttimejob.parttimejob.controller.review;

import com.parttimejob.parttimejob.dto.request.StoreReviewRequest;
import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.ReviewResponse;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.review.StoreReviewEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.service.review.StoreReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/store-reviews")
@RequiredArgsConstructor
public class StoreReviewController {

    private final StoreReviewService storeReviewService;
    private final UserRepository userRepository;

    @GetMapping("/store/{storeId}")
    public ResponseEntity<ApiResponse<List<ReviewResponse>>> getStoreReviews(@PathVariable Integer storeId) {
        List<ReviewResponse> result = storeReviewService.getStoreReviews(storeId);

        return ResponseEntity.ok(ApiResponse.<List<ReviewResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get store reviews successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/store/{storeId}/job-post/{jobPostId}/permission")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<StoreReviewService.ReviewPermissionResponse>> canUserReviewStore(
            @PathVariable Integer storeId,
            @PathVariable Integer jobPostId
    ) {
        Integer userId = getCurrentUserId();
        StoreReviewService.ReviewPermissionResponse result = storeReviewService.canUserReviewStore(userId, storeId, jobPostId);

        return ResponseEntity.ok(ApiResponse.<StoreReviewService.ReviewPermissionResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Check review permission successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @RequestParam Integer storeId,
            @RequestParam Integer employmentRecordId,
            @RequestBody StoreReviewRequest request
    ) {
        Integer userId = getCurrentUserId();
        ReviewResponse result = storeReviewService.createReview(userId, storeId, employmentRecordId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ReviewResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Create store review successfully")
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
