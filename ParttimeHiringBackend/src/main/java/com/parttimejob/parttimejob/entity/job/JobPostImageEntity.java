package com.parttimejob.parttimejob.entity.job;

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
@Table(name = "job_post_images")
public class JobPostImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "job_post_id", nullable = false)
    JobPostEntity jobPost;

    @Column(name = "image_url", nullable = false, length = 500)
    String imageUrl;

    @Column(name = "sort_order", nullable = false)
    Integer sortOrder;

    @Column(name = "uploaded_at", nullable = false)
    LocalDateTime uploadedAt;
}