package com.parttimejob.parttimejob.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobPostCreationRequest {
    // Chỉ cần ID để map quan hệ
    Integer employerId;
    Integer storeId;

    String title;
    String jobDescription;
    String requirements;
    String benefits;

    BigDecimal hourlyWageMin;
    BigDecimal hourlyWageMax;
    String currency; // Thường mặc định là "VND"

    Integer vacancyCount;
    Integer minAge;
    Integer maxAge;
    String genderRequirement; // "MALE", "FEMALE", "BOTH"
    String employmentType;    // "PART_TIME", "TEMPORARY"

    LocalDateTime expiredAt;

    // Chỉ cần danh sách ID, Backend sẽ đi tìm Entity tương ứng
    Set<Integer> categoryIds;
    Set<Integer> shiftIds;
}
