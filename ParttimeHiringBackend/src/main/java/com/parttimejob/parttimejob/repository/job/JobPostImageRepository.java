package com.parttimejob.parttimejob.repository.job;

import com.parttimejob.parttimejob.entity.job.JobPostImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobPostImageRepository extends JpaRepository<JobPostImageEntity, Integer> {

    List<JobPostImageEntity> findByJobPostId(Integer jobPostId);

    Optional<JobPostImageEntity> findFirstByJobPostIdOrderBySortOrderAsc(Integer jobPostId);

    Optional<JobPostImageEntity> findFirstByJobPostIdOrderBySortOrderDesc(Integer jobPostId);

    boolean existsByJobPostId(Integer jobPostId);

    long countByJobPostId(Integer jobPostId);

    void deleteByJobPostId(Integer jobPostId);
}
