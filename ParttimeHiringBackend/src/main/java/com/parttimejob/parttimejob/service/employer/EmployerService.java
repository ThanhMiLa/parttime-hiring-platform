package com.parttimejob.parttimejob.service.employer;

import com.parttimejob.parttimejob.dto.response.EmployerResponse;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.identity.RoleEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.employer.EmployerRepository;
import com.parttimejob.parttimejob.repository.identity.RoleRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class EmployerService {

    EmployerRepository employerRepository;
    UserRepository userRepository;
    RoleRepository roleRepository;

    public List<EmployerResponse> getAllEmployers() {
        return employerRepository.findAllBy().stream()
                .map(this::mapToResponse)
                .toList();
    }

    public EmployerResponse getEmployerById(Integer id) {
        EmployerEntity employer = employerRepository.findWithUserById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYER_NOT_FOUND));
        return mapToResponse(employer);
    }

    @Transactional
    public EmployerResponse createEmployer(Integer userId, EmployerEntity request) {
        if (employerRepository.existsByUserId(userId)) {
            throw new AppException(ErrorCode.EMPLOYER_ALREADY_EXISTED);
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        request.setUser(user);
        if (request.getStatus() == null || request.getStatus().isBlank()) {
            request.setStatus("ACTIVE");
        }

        // Thiết lập thời gian khởi tạo
        request.setCreatedAt(LocalDateTime.now());
        request.setUpdatedAt(LocalDateTime.now());

        EmployerEntity saved = employerRepository.save(request);
        assignEmployerRole(user);

        return mapToResponse(saved);
    }

    @Transactional
    public EmployerResponse updateStatus(Integer employerId, String status) {
        EmployerEntity employer = employerRepository.findById(employerId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYER_NOT_FOUND));

        employer.setStatus(status);
        employer.setUpdatedAt(LocalDateTime.now());

        if ("ACTIVE".equals(status)) {
            assignEmployerRole(employer.getUser());
        }

        return mapToResponse(employerRepository.save(employer));
    }

    private void assignEmployerRole(UserEntity user) {
        RoleEntity employerRole = roleRepository.findById("EMPLOYER")
                .orElseThrow(() -> new AppException(ErrorCode.UNAUTHORIZED));

        Set<RoleEntity> roles = user.getRoles() == null ? new HashSet<>() : new HashSet<>(user.getRoles());
        roles.add(employerRole);
        user.setRoles(roles);
        userRepository.save(user);
    }

    // Hàm Map dữ liệu quan trọng
    private EmployerResponse mapToResponse(EmployerEntity entity) {
        return EmployerResponse.builder()
                .id(entity.getId())
                .userId(entity.getUser().getId())
                .username(entity.getUser().getUsername())
                .companyName(entity.getCompanyName())
                .businessType(entity.getBusinessType())
                .emailContact(entity.getEmailContact())
                .phoneContact(entity.getPhoneContact())
                .description(entity.getDescription())
                .website(entity.getWebsite())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
