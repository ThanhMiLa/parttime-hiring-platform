package com.parttimejob.parttimejob.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class JobCategoryResponse {
    Integer id;
    String categoryName;
    String slug;
    String description;
}
