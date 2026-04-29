package com.parttimejob.parttimejob.repository.job;

import com.parttimejob.parttimejob.entity.job.WorkShiftEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkShiftRepository extends JpaRepository<WorkShiftEntity, Integer> {

    boolean existsByShiftName(String shiftName);

    List<WorkShiftEntity> findAllByIsActiveTrueOrderBySortOrderAsc();

    List<WorkShiftEntity> findAllByOrderBySortOrderAsc();
}