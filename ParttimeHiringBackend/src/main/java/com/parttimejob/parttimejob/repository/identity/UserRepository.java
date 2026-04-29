package com.parttimejob.parttimejob.repository.identity;

import com.parttimejob.parttimejob.entity.identity.UserEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {
    Optional<UserEntity> findByUsername(String username);

    @EntityGraph(attributePaths = {"roles", "roles.permissions"})
    Optional<UserEntity> findWithRolesAndPermissionsByUsername(String username);

    void deleteByUsername(String username);

    boolean existsByUsername(String username);

}
