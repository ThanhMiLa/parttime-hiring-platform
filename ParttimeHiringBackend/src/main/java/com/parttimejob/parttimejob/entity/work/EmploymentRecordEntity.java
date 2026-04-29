package com.parttimejob.parttimejob.entity.work;

import com.parttimejob.parttimejob.entity.application.JobApplicationEntity;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Builder
@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "employment_records")
public class EmploymentRecordEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employment_record_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    UserEntity user;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    StoreEntity store;

    @ManyToOne
    @JoinColumn(name = "job_post_id")
    JobPostEntity jobPost;

    @OneToOne
    @JoinColumn(name = "application_id")
    JobApplicationEntity application;

    @ManyToOne
    @JoinColumn(name = "verified_by_employer_id")
    EmployerEntity verifiedByEmployer;

    @Column(name = "start_date")
    LocalDate startDate;

    @Column(name = "end_date")
    LocalDate endDate;

    @Column(name = "work_status", nullable = false)
    String workStatus;

    @Column(name = "verified_at")
    LocalDateTime verifiedAt;

    @Column(name = "note", columnDefinition = "TEXT")
    String note;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;
}