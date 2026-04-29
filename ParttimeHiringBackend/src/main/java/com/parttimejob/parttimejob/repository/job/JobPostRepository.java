package com.parttimejob.parttimejob.repository.job;

import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.Collection;
import java.util.List;

@Repository
public interface JobPostRepository extends JpaRepository<JobPostEntity, Integer>, JpaSpecificationExecutor<JobPostEntity> {

    List<JobPostEntity> findTop10ByStatusOrderByCreatedAtDesc(String status);

    List<JobPostEntity> findTop20ByEmployerIdOrderByCreatedAtDesc(Integer employerId);

    List<JobPostEntity> findByStoreId(Integer storeId);

    @Query("""
            SELECT DISTINCT jp
            FROM JobPostEntity jp
            LEFT JOIN FETCH jp.store
            LEFT JOIN FETCH jp.employer
            WHERE jp.id IN :ids
            """)
    List<JobPostEntity> findAllWithStoreEmployerByIdIn(@Param("ids") Collection<Integer> ids);

    @Query("""
            SELECT jp.id AS jobPostId, c.categoryName AS categoryName
            FROM JobPostEntity jp
            JOIN jp.categories c
            WHERE jp.id IN :ids
            """)
    List<JobPostCategoryView> findCategoryViewsByJobPostIds(@Param("ids") Collection<Integer> ids);

    @Query("""
            SELECT jp.id AS jobPostId, s.shiftName AS shiftName, s.startTime AS startTime, s.endTime AS endTime
            FROM JobPostEntity jp
            JOIN jp.shifts s
            WHERE jp.id IN :ids
            ORDER BY jp.id, s.sortOrder
            """)
    List<JobPostShiftView> findShiftViewsByJobPostIds(@Param("ids") Collection<Integer> ids);

    @Query("""
            SELECT jp.id AS jobPostId, i.imageUrl AS imageUrl, i.sortOrder AS sortOrder
            FROM JobPostEntity jp
            JOIN jp.images i
            WHERE jp.id IN :ids
            ORDER BY jp.id, i.sortOrder
            """)
    List<JobPostImageView> findImageViewsByJobPostIds(@Param("ids") Collection<Integer> ids);

    Long countByEmployerId(Integer employerId);

    Long countByEmployerIdAndStatus(Integer employerId, String status);

    interface JobPostCategoryView {
        Integer getJobPostId();

        String getCategoryName();
    }

    interface JobPostShiftView {
        Integer getJobPostId();

        String getShiftName();

        LocalTime getStartTime();

        LocalTime getEndTime();
    }

    interface JobPostImageView {
        Integer getJobPostId();

        String getImageUrl();

        Integer getSortOrder();
    }
}
