package com.parttimejob.parttimejob.repository.job;

import com.parttimejob.parttimejob.entity.job.JobCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobCategoryRepository extends JpaRepository<JobCategoryEntity, Integer> {

    boolean existsByCategoryName(String categoryName);

    boolean existsBySlug(String slug);

    Optional<JobCategoryEntity> findBySlug(String slug);

    List<JobCategoryEntity> findAllByIsActiveTrueOrderBySortOrderAsc();

    List<JobCategoryEntity> findAllByOrderBySortOrderAsc();
}