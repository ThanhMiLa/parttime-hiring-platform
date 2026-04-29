package com.parttimejob.parttimejob.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StoreCreationRequest {
    // ID của chủ sở hữu cửa hàng
    Integer employerId;

    String storeName;
    String phoneContact;
    String description;

    // Các trường địa chỉ bắt buộc để lọc tìm kiếm
    String city;
    String district;
    String ward;
    String streetAddress;

    // Tọa độ (có thể null nếu demo không dùng bản đồ)
    BigDecimal latitude;
    BigDecimal longitude;
}
