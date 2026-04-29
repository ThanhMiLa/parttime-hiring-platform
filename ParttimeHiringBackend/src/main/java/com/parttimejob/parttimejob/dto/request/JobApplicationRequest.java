package com.parttimejob.parttimejob.dto.request.application;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobApplicationRequest {

    Integer jobPostId;

    String contactPhone;

    String note;
}