package com.parttimejob.parttimejob.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobSearchRequest {
    String title;
    String storeName;

    String city;
    String district;
    String ward;
    String streetAddress;
    String addressKeyword;

    BigDecimal minHourlyWage;
    BigDecimal maxHourlyWage;

    Integer categoryId;
    Integer shiftId;
}
