package com.parttimejob.parttimejob.dto.response;

import com.parttimejob.parttimejob.entity.job.JobPostImageEntity;
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
public class JobPostResponse {
    Integer id;
    Integer storeId;
    String title;
    String jobDescription;
    String requirements;
    String benefits;

    BigDecimal hourlyWageMin;
    BigDecimal hourlyWageMax;
    String currency;

    Integer vacancyCount;
    Integer minAge;
    Integer maxAge;
    String genderRequirement;
    String employmentType;
    String status;

    LocalDateTime publishedAt;
    LocalDateTime expiredAt;

    // Thông tin employer/store
    String employerName;
    String storeName;
    String phoneContact;

    // Thông tin địa chỉ store
    String city;
    String district;
    String ward;
    String streetAddress;
    String fullAddress;
    BigDecimal latitude;
    BigDecimal longitude;

    Set<String> categories;
    Set<ShiftResponse> shifts;
    Set<JobPostImageResponse> images;
}