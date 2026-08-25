package com.parttimejob.parttimejob.repository.application;

import com.parttimejob.parttimejob.entity.application.JobApplicationEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplicationEntity, Integer> {

    boolean existsByApplicantIdAndJobPostId(Integer applicantId, Integer jobPostId);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.store", "applicant"})
    Page<JobApplicationEntity> findAllByApplicantId(Integer applicantId, Pageable pageable);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.store", "applicant"})
    List<JobApplicationEntity> findAllByApplicantIdOrderByAppliedAtDesc(Integer applicantId);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.store", "applicant"})
    List<JobApplicationEntity> findAllByJobPostIdOrderByAppliedAtDesc(Integer jobPostId);

    @EntityGraph(attributePaths = {"jobPost", "jobPost.store", "applicant", "jobPost.employer"})
    Optional<JobApplicationEntity> findWithDetailsById(Integer id);

    @Query("SELECT COUNT(ja) FROM JobApplicationEntity ja WHERE ja.jobPost.id = :jobPostId AND ja.status = 'PENDING'")
    long countByJobPostId(@Param("jobPostId") Integer jobPostId);

    @Query("SELECT COUNT(ja) FROM JobApplicationEntity ja WHERE ja.jobPost.store.id = :storeId AND ja.status = 'PENDING'")
    long countByJobPost_StoreId(@Param("storeId") Integer storeId);

    long countByJobPost_Employer_IdAndStatus(Integer employerId, String status);
}
