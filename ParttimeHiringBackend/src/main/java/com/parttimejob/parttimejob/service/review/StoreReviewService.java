package com.parttimejob.parttimejob.service.review;

import com.parttimejob.parttimejob.dto.request.StoreReviewRequest;
import com.parttimejob.parttimejob.dto.response.ReviewResponse;
import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.review.StoreReviewEntity;
import com.parttimejob.parttimejob.entity.work.EmploymentRecordEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.employer.StoreRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.repository.review.StoreReviewRepository;
import com.parttimejob.parttimejob.repository.work.EmploymentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StoreReviewService {

    private final StoreReviewRepository storeReviewRepository;
    private final EmploymentRecordRepository employmentRecordRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;

    public ReviewResponse createReview(Integer userId, Integer storeId, Integer employmentRecordId, StoreReviewRequest request) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        StoreEntity store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        EmploymentRecordEntity employmentRecord = employmentRecordRepository.findById(employmentRecordId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYMENT_RECORD_NOT_FOUND));

        if (!employmentRecord.getUser().getId().equals(userId) || !employmentRecord.getStore().getId().equals(storeId)) {
            throw new AppException(ErrorCode.STORE_REVIEW_INVALID_RECORD);
        }

        if (storeReviewRepository.existsByEmploymentRecordId(employmentRecordId)) {
            throw new AppException(ErrorCode.STORE_REVIEW_ALREADY_EXISTED);
        }

        LocalDateTime now = LocalDateTime.now();
        StoreReviewEntity review = StoreReviewEntity.builder()
                .reviewer(user)
                .store(store)
                .employmentRecord(employmentRecord)
                .rating(request.getRating())
                .comment(request.getComment())
                .status("VISIBLE")
                .createdAt(now)
                .updatedAt(now)
                .build();

        storeReviewRepository.save(review);

        return mapToReviewResponse(review);
    }

    public List<ReviewResponse> getStoreReviews(Integer storeId) {
        var storeReviewList = storeReviewRepository.findAllByStoreIdOrderByCreatedAtDesc(storeId);
        return storeReviewList.stream()
                .map(this::mapToReviewResponse)
                .toList();
    }

    public void deleteReview(Integer reviewId) {
        StoreReviewEntity review = storeReviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_REVIEW_NOT_FOUND));
        storeReviewRepository.delete(review);
    }

    public ReviewPermissionResponse canUserReviewStore(Integer userId, Integer storeId, Integer jobPostId) {
        boolean hasWorked = employmentRecordRepository.existsByUserIdAndStoreIdAndJobPostId(userId, storeId, jobPostId);
        Optional<Integer> employmentRecordId = employmentRecordRepository.findEmploymentRecordIdByUserIdAndStoreIdAndJobPostId(userId, storeId, jobPostId);
        return new ReviewPermissionResponse(hasWorked, employmentRecordId);
    }

    public record ReviewPermissionResponse(boolean hasWorked, Optional<Integer> employmentRecordId) {
    }

    private ReviewResponse mapToReviewResponse(StoreReviewEntity review) {
        return ReviewResponse.builder()
                .displayName(review.getReviewer().getUsername())
                .storeName(review.getStore().getStoreName())
                .comment(review.getComment())
                .createAt(review.getCreatedAt())
                .rating(review.getRating())
                .build();
    }

}
