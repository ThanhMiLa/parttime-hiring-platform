package com.parttimejob.parttimejob.controller.admin;

import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.ShiftResponse;
import com.parttimejob.parttimejob.entity.job.WorkShiftEntity;
import com.parttimejob.parttimejob.service.job.WorkShiftService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/admin/work-shifts")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminWorkShiftController {

    private final WorkShiftService workShiftService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ShiftResponse>>> getAllShifts() {
        return ResponseEntity.ok(ApiResponse.<List<ShiftResponse>>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Get all work shifts successfully")
                .result(workShiftService.getAllShifts())
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PostMapping
    public ResponseEntity<ApiResponse<ShiftResponse>> createShift(@RequestBody WorkShiftEntity request) {
        ShiftResponse result = workShiftService.createShift(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.<ShiftResponse>builder()
                .status(HttpStatus.CREATED.value())
                .code(1000)
                .message("Create work shift successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @PutMapping("/{shiftId}")
    public ResponseEntity<ApiResponse<ShiftResponse>> updateShift(
            @PathVariable Integer shiftId,
            @RequestBody WorkShiftEntity request
    ) {
        ShiftResponse result = workShiftService.updateShift(shiftId, request);

        return ResponseEntity.ok(ApiResponse.<ShiftResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Update work shift successfully")
                .result(result)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }

    @DeleteMapping("/{shiftId}")
    public ResponseEntity<ApiResponse<Void>> deleteShift(@PathVariable Integer shiftId) {
        workShiftService.deleteShift(shiftId);

        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Delete work shift successfully")
                .result(null)
                .timestamp(LocalDateTime.now().toString())
                .build());
    }
}