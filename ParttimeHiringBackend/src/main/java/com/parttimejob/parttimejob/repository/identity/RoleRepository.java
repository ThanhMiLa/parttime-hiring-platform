package com.parttimejob.parttimejob.repository.identity;

import com.parttimejob.parttimejob.entity.identity.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<RoleEntity, String> {
}
