package com.parttimejob.parttimejob.configuration;

import com.parttimejob.parttimejob.entity.identity.RoleEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.repository.identity.RoleRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository) {
        log.info("Init application ... ");
        return args -> {
            if (userRepository.findByUsername("admin").isEmpty()) {
                Set<RoleEntity> roles = new HashSet<>();
                var role = roleRepository.findById("ADMIN").orElseGet(() -> {
                    RoleEntity roleEntity = RoleEntity.builder()
                            .name("ADMIN")
                            .description("System administrator")
                            .build();
                    return roleRepository.save(roleEntity);
                });
                roles.add(role);
                UserEntity userEntity = UserEntity.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin"))
                        .displayName("admin")
                        .dob(LocalDate.parse("2005-06-10"))
                        .roles(roles)
                        .build();
                userRepository.save(userEntity);
                log.warn("Admin user has been create with password admin, please change it");
            }
        };
    }
}
