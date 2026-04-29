package com.parttimejob.parttimejob.entity.application;

import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Builder
@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "job_applications")
public class JobApplicationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "job_post_id", nullable = false)
    JobPostEntity jobPost;

    @ManyToOne
    @JoinColumn(name = "applicant_user_id", nullable = false)
    UserEntity applicant;

    @Column(name = "contact_phone")
    String contactPhone;

    @Column(name = "note", columnDefinition = "TEXT")
    String note;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "applied_at")
    LocalDateTime appliedAt;

    @Column(name = "updated_at")
    LocalDateTime updatedAt;
}
