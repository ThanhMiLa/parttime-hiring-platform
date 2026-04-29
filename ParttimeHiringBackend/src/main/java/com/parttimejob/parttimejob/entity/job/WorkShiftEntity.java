package com.parttimejob.parttimejob.entity.job;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalTime;
import java.util.Set;

@Builder
@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "work_shifts")
public class WorkShiftEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "shift_id")
    Integer id;

    @Column(name = "shift_name", nullable = false, unique = true)
    String shiftName;

    @Column(name = "start_time")
    LocalTime startTime;

    @Column(name = "end_time")
    LocalTime endTime;

    @Column(name = "is_flexible", nullable = false)
    Boolean isFlexible;

    @Column(name = "sort_order", nullable = false)
    Integer sortOrder;

    @Column(name = "is_active", nullable = false)
    Boolean isActive;

    @ManyToMany(mappedBy = "shifts")
    Set<JobPostEntity> jobPosts;
}