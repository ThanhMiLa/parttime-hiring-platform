package com.parttimejob.parttimejob.controller.publicapi;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.ShiftResponse;
import com.parttimejob.parttimejob.entity.job.WorkShiftEntity;
import com.parttimejob.parttimejob.service.job.WorkShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/work-shifts")
@RequiredArgsConstructor
public class WorkShiftController {

    private final WorkShiftService workShiftService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShiftResponse>>> getAllActiveShifts() {
        List<ShiftResponse> result = workShiftService.getAllActiveShifts();

        return ResponseEntity.ok(ApiResponse.<List<ShiftResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get work shifts successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @GetMapping("/{shiftId}")
    public ResponseEntity<ApiResponse<ShiftResponse>> getShiftById(@PathVariable Integer shiftId) {
        ShiftResponse result = workShiftService.getShiftById(shiftId);

        return ResponseEntity.ok(ApiResponse.<ShiftResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get work shift detail successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}