package com.parttimejob.parttimejob.repository.review;

import com.parttimejob.parttimejob.entity.review.StoreReviewEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StoreReviewRepository extends JpaRepository<StoreReviewEntity, Integer> {

    boolean existsByEmploymentRecordId(Integer employmentRecordId);

    @EntityGraph(attributePaths = {"reviewer", "store"})
    List<StoreReviewEntity> findAllByStoreIdOrderByCreatedAtDesc(Integer storeId);
}
