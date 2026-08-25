package com.parttimejob.parttimejob.repository.work;

import com.parttimejob.parttimejob.entity.work.EmploymentRecordEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmploymentRecordRepository extends JpaRepository<EmploymentRecordEntity, Integer> {

    List<EmploymentRecordEntity> findAllByUserIdOrderByCreatedAtDesc(Integer userId);

    List<EmploymentRecordEntity> findAllByStoreIdOrderByCreatedAtDesc(Integer storeId);



    boolean existsByUserIdAndStoreIdAndJobPostId(Integer userId, Integer storeId, Integer jobPostId);

    @Query("""
        select er.id
        from EmploymentRecordEntity er
        where er.user.id = :userId
          and er.store.id = :storeId
          and er.jobPost.id = :jobPostId
    """)
    Optional<Integer> findEmploymentRecordIdByUserIdAndStoreIdAndJobPostId(
            @Param("userId") Integer userId,
            @Param("storeId") Integer storeId,
            @Param("jobPostId") Integer jobPostId
    );



}