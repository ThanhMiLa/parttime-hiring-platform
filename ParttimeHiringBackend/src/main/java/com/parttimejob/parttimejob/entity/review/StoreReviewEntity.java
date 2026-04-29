package com.parttimejob.parttimejob.entity.review;

import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.work.EmploymentRecordEntity;
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
@Table(
        name = "store_reviews",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uq_store_reviews_employment_record",
                        columnNames = {"employment_record_id"}
                )
        }
)
public class StoreReviewEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "review_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "store_id", nullable = false)
    StoreEntity store;

    @ManyToOne
    @JoinColumn(name = "reviewer_user_id", nullable = false)
    UserEntity reviewer;

    @OneToOne
    @JoinColumn(name = "employment_record_id", nullable = false, unique = true)
    EmploymentRecordEntity employmentRecord;

    @Column(name = "rating", nullable = false)
    Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    String comment;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;
}