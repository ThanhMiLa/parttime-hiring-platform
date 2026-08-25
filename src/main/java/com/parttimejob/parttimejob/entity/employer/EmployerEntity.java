package com.parttimejob.parttimejob.entity.employer;

import com.parttimejob.parttimejob.entity.identity.UserEntity;
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
@Table(name = "employers")
public class EmployerEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "employer_id")
    Integer id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    UserEntity user;

    @Column(name = "company_name", nullable = false)
    String companyName;

    @Column(name = "business_type")
    String businessType;

    @Column(name = "email_contact")
    String emailContact;

    @Column(name = "phone_contact")
    String phoneContact;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @Column(name = "website")
    String website;

    @Column(name = "status", nullable = false)
    String status;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;
}