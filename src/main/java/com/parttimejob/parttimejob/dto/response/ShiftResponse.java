package com.parttimejob.parttimejob.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ShiftResponse {
    Integer id;
    String shiftName;
    LocalTime startTime;
    LocalTime endTime;
    Boolean isFlexible;
}
