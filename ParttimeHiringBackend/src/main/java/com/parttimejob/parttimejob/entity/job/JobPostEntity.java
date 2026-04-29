package com.parttimejob.parttimejob.entity.job;

import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Builder
@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_posts")
public class JobPostEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "job_post_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    EmployerEntity employer;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    StoreEntity store;

    @Column(name = "title", nullable = false)
    String title;

    @Column(name = "job_description", nullable = false, columnDefinition = "TEXT")
    String jobDescription;

    @Column(name = "requirements", columnDefinition = "TEXT")
    String requirements;

    @Column(name = "benefits", columnDefinition = "TEXT")
    String benefits;

    @Column(name = "hourly_wage_min", nullable = false, precision = 10, scale = 2)
    BigDecimal hourlyWageMin;

    @Column(name = "hourly_wage_max", precision = 10, scale = 2)
    BigDecimal hourlyWageMax;

    @Column(name = "currency", nullable = false)
    String currency;

    @Column(name = "vacancy_count", nullable = false)
    Integer vacancyCount;

    @Column(name = "min_age")
    Integer minAge;

    @Column(name = "max_age")
    Integer maxAge;

    @Column(name = "gender_requirement", nullable = false)
    String genderRequirement;

    @Column(name = "employment_type", nullable = false)
    String employmentType;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "published_at")
    LocalDateTime publishedAt;

    @Column(name = "expired_at")
    LocalDateTime expiredAt;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
            name = "job_post_categories",
            joinColumns = @JoinColumn(name = "job_post_id"),
            inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    Set<JobCategoryEntity> categories;

    @ManyToMany
    @JoinTable(
            name = "job_post_shifts",
            joinColumns = @JoinColumn(name = "job_post_id"),
            inverseJoinColumns = @JoinColumn(name = "shift_id")
    )
    Set<WorkShiftEntity> shifts;

    @OneToMany(mappedBy = "jobPost", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    @Builder.Default
    Set<JobPostImageEntity> images = new LinkedHashSet<>();
}