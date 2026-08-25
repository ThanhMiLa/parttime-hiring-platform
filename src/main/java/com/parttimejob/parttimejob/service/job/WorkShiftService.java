package com.parttimejob.parttimejob.service.job;

import com.parttimejob.parttimejob.dto.response.ShiftResponse;
import com.parttimejob.parttimejob.entity.job.WorkShiftEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.job.WorkShiftRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkShiftService {

    private final WorkShiftRepository workShiftRepository;

    public List<ShiftResponse> getAllActiveShifts() {
        return workShiftRepository.findAllByIsActiveTrueOrderBySortOrderAsc().stream()
                .map(this::mapToShiftResponse)
                .toList();
    }

    public List<ShiftResponse> getAllShifts() {
        return workShiftRepository.findAllByOrderBySortOrderAsc().stream()
                .map(this::mapToShiftResponse)
                .toList();
    }

    public ShiftResponse getShiftById(Integer shiftId) {
        var workShift = workShiftRepository.findById(shiftId)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_SHIFT_NOT_FOUND));
        return mapToShiftResponse(workShift);
    }

    public ShiftResponse createShift(WorkShiftEntity request) {
        if (workShiftRepository.existsByShiftName(request.getShiftName())) {
            throw new AppException(ErrorCode.WORK_SHIFT_NAME_EXISTED);
        }
        WorkShiftEntity saved = workShiftRepository.save(request);
        return mapToShiftResponse(saved);
    }

    public ShiftResponse updateShift(Integer shiftId, WorkShiftEntity request) {
        WorkShiftEntity shift = workShiftRepository.findById(shiftId)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_SHIFT_NOT_FOUND));

        shift.setShiftName(request.getShiftName());
        shift.setStartTime(request.getStartTime());
        shift.setEndTime(request.getEndTime());
        shift.setIsFlexible(request.getIsFlexible());
        shift.setSortOrder(request.getSortOrder());
        shift.setIsActive(request.getIsActive());

        WorkShiftEntity updated = workShiftRepository.save(shift);
        return mapToShiftResponse(updated);
    }

    public void deleteShift(Integer shiftId) {
        WorkShiftEntity shift = workShiftRepository.findById(shiftId)
                .orElseThrow(() -> new AppException(ErrorCode.WORK_SHIFT_NOT_FOUND));
        workShiftRepository.delete(shift);
    }

    public ShiftResponse mapToShiftResponse(WorkShiftEntity entity) {
        if (entity == null) return null;

        return ShiftResponse.builder()
                .id(entity.getId())
                .shiftName(entity.getShiftName())
                .startTime(entity.getStartTime())
                .endTime(entity.getEndTime())
                .isFlexible(entity.getIsFlexible())
                .build();
    }
}