package com.parttimejob.parttimejob.entity.identity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;
import java.util.Date;

@Builder
@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "invalidated_token")
public class InvalidatedTokenEntity {
    @Id
    @Column(name = "jti", nullable = false)
    String id;

    @Column(name = "expiry_time", nullable = false)
    Date expiryTime;
}
