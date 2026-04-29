package com.parttimejob.parttimejob.repository.employer;

import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StoreRepository extends JpaRepository<StoreEntity, Integer> {

    boolean existsByStoreNameAndEmployerId(String storeName, Integer employerId);

    @EntityGraph(attributePaths = {"employer"})
    List<StoreEntity> findAllByEmployerIdOrderByCreatedAtDesc(Integer employerId);

    List<StoreEntity> findAllByIsActiveTrueOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"employer"})
    Page<StoreEntity> findAllByEmployerId(Integer employerId, Pageable pageable);

    @EntityGraph(attributePaths = {"employer"})
    Optional<StoreEntity> findWithEmployerById(Integer id);

    Long countByEmployerId(Integer employerId);
}
