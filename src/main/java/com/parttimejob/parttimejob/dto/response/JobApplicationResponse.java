package com.parttimejob.parttimejob.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobApplicationResponse {
    Integer id;

    // Thông tin công việc (Rất quan trọng cho Ứng viên xem lại)
    Integer jobPostId;
    String jobTitle;
    String companyName;

    // Thông tin ứng viên (Rất quan trọng cho Nhà tuyển dụng duyệt)
    Integer applicantId;
    String applicantFullName;

    // Thông tin đơn ứng tuyển
    String contactPhone;
    String note;
    String status; // PENDING, ACCEPTED, REJECTED

    LocalDateTime appliedAt;
}
