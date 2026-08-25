package com.parttimejob.parttimejob.repository.employer;

import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployerRepository extends JpaRepository<EmployerEntity, Integer> {

    boolean existsByUserId(Integer userId);

    Optional<EmployerEntity> findByUserId(Integer userId);

    @EntityGraph(attributePaths = {"user"})
    List<EmployerEntity> findAllBy();

    @EntityGraph(attributePaths = {"user"})
    Optional<EmployerEntity> findWithUserById(Integer id);
}
