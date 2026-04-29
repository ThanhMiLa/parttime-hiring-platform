package com.parttimejob.parttimejob.repository.identity;

import com.parttimejob.parttimejob.entity.identity.PermissionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<PermissionEntity, String> {
}
