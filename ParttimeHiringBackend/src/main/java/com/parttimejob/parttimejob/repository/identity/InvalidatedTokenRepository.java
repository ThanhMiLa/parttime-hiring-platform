package com.parttimejob.parttimejob.repository.identity;

import com.parttimejob.parttimejob.entity.identity.InvalidatedTokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvalidatedTokenRepository extends JpaRepository<InvalidatedTokenEntity, String> {
}
