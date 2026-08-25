package com.parttimejob.parttimejob.service.job;

import com.parttimejob.parttimejob.dto.response.JobCategoryResponse;
import com.parttimejob.parttimejob.entity.job.JobCategoryEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.job.JobCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobCategoryService {

    private final JobCategoryRepository jobCategoryRepository;

    public List<JobCategoryResponse> getAllActiveCategories() {
        return jobCategoryRepository.findAllByIsActiveTrueOrderBySortOrderAsc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Chuyển sang trả về List Response để đồng bộ
    public List<JobCategoryResponse> getAllCategories() {
        return jobCategoryRepository.findAllByOrderBySortOrderAsc().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public JobCategoryResponse getCategoryById(Integer categoryId) {
        var jobCategory = jobCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_CATEGORY_NOT_FOUND));
        return mapToResponse(jobCategory);
    }

    // Vẫn giữ Entity cho các logic nội bộ nếu cần,
    // nhưng trả về Response cho Controller
    public JobCategoryResponse createCategory(JobCategoryEntity request) {
        if (jobCategoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new AppException(ErrorCode.JOB_CATEGORY_NAME_EXISTED);
        }

        if (jobCategoryRepository.existsBySlug(request.getSlug())) {
            throw new AppException(ErrorCode.JOB_CATEGORY_SLUG_EXISTED);
        }

        JobCategoryEntity saved = jobCategoryRepository.save(request);
        return mapToResponse(saved);
    }

    public JobCategoryResponse updateCategory(Integer categoryId, JobCategoryEntity request) {
        JobCategoryEntity category = jobCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_CATEGORY_NOT_FOUND));

        category.setCategoryName(request.getCategoryName());
        category.setSlug(request.getSlug());
        category.setDescription(request.getDescription());
        category.setIsActive(request.getIsActive());
        category.setSortOrder(request.getSortOrder());

        JobCategoryEntity updated = jobCategoryRepository.save(category);
        return mapToResponse(updated);
    }

    public void deleteCategory(Integer categoryId) {
        JobCategoryEntity category = jobCategoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_CATEGORY_NOT_FOUND));
        jobCategoryRepository.delete(category);
    }

    // Hàm Map trung tâm
    public JobCategoryResponse mapToResponse(JobCategoryEntity entity) {
        if (entity == null) return null;

        return JobCategoryResponse.builder()
                .id(entity.getId())
                .categoryName(entity.getCategoryName())
                .slug(entity.getSlug())
                .description(entity.getDescription())
                .build();
    }
}