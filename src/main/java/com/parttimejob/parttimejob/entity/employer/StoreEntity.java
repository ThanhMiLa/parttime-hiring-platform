package com.parttimejob.parttimejob.entity.employer;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Builder
@Entity
@Getter
@Setter
@FieldDefaults(level = AccessLevel.PRIVATE)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "stores")
public class StoreEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "store_id")
    Integer id;

    @ManyToOne
    @JoinColumn(name = "employer_id", nullable = false)
    EmployerEntity employer;

    @Column(name = "store_name", nullable = false)
    String storeName;

    @Column(name = "phone_contact")
    String phoneContact;

    @Column(name = "description", columnDefinition = "TEXT")
    String description;

    @Column(name = "city", nullable = false)
    String city;

    @Column(name = "district")
    String district;

    @Column(name = "ward")
    String ward;

    @Column(name = "street_address")
    String streetAddress;

    @Column(name = "latitude", precision = 10, scale = 8)
    BigDecimal latitude;

    @Column(name = "longitude", precision = 11, scale = 8)
    BigDecimal longitude;

    @Column(name = "is_active", nullable = false)
    Boolean isActive;

    @Column(name = "created_at", nullable = false)
    LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    LocalDateTime updatedAt;
}