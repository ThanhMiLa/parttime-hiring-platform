package com.parttimejob.parttimejob.entity.job;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

@Builder
@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_categories")
public class JobCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    Integer id;

    @Column(name = "category_name", nullable = false, unique = true)
    String categoryName;

    @Column(name = "slug", nullable = false, unique = true)
    String slug;

    @Column(name = "description")
    String description;

    @Column(name = "is_active", nullable = false)
    Boolean isActive;

    @Column(name = "sort_order", nullable = false)
    Integer sortOrder;

    @ManyToMany(mappedBy = "categories")
    Set<JobPostEntity> jobPosts;
}