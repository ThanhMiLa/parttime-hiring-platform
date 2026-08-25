package com.parttimejob.parttimejob.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class EmployerResponse {
    Integer id;

    // Thông tin từ UserEntity (Identity)
    Integer userId;
    String username;

    // Thông tin doanh nghiệp
    String companyName;
    String businessType;
    String emailContact;
    String phoneContact;
    String description;
    String website;

    // Trạng thái và thời gian
    String status;
    LocalDateTime createdAt;
}