package com.parttimejob.parttimejob.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreResponse {
    Integer id;
    String storeName;
    String phoneContact;
    String description;

    // Địa chỉ chi tiết
    String city;
    String district;
    String ward;
    String streetAddress;

    // Địa chỉ đầy đủ (Gộp lại để Frontend hiển thị cho nhanh)
    String fullAddress;

    // Tọa độ để vẽ lên bản đồ (nếu cần)
    BigDecimal latitude;
    BigDecimal longitude;

    Boolean isActive;

    // Chỉ trả về ID hoặc tên Employer, tránh trả về nguyên Object Employer
    Integer employerId;
    String employerName;
}