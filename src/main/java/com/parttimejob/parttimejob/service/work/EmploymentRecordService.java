package com.parttimejob.parttimejob.service.work;

import com.parttimejob.parttimejob.entity.application.JobApplicationEntity;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import com.parttimejob.parttimejob.entity.work.EmploymentRecordEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.application.JobApplicationRepository;
import com.parttimejob.parttimejob.repository.employer.EmployerRepository;
import com.parttimejob.parttimejob.repository.employer.StoreRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.repository.job.JobPostRepository;
import com.parttimejob.parttimejob.repository.work.EmploymentRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmploymentRecordService {

    private final EmploymentRecordRepository employmentRecordRepository;
    private final UserRepository userRepository;
    private final StoreRepository storeRepository;
    private final JobPostRepository jobPostRepository;
    private final JobApplicationRepository jobApplicationRepository;
    private final EmployerRepository employerRepository;

    public EmploymentRecordEntity createEmploymentRecord(
            Integer userId,
            Integer storeId,
            Integer jobPostId,
            Integer applicationId,
            Integer verifiedByEmployerId,
            EmploymentRecordEntity request
    ) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        StoreEntity store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        request.setUser(user);
        request.setStore(store);

        if (jobPostId != null) {
            JobPostEntity jobPost = jobPostRepository.findById(jobPostId)
                    .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_FOUND));
            request.setJobPost(jobPost);
        }

        if (applicationId != null) {
            JobApplicationEntity application = jobApplicationRepository.findById(applicationId)
                    .orElseThrow(() -> new AppException(ErrorCode.JOB_APPLICATION_NOT_FOUND));
            request.setApplication(application);
        }

        if (verifiedByEmployerId != null) {
            EmployerEntity employer = employerRepository.findById(verifiedByEmployerId)
                    .orElseThrow(() -> new AppException(ErrorCode.EMPLOYER_NOT_FOUND));
            request.setVerifiedByEmployer(employer);
            request.setVerifiedAt(LocalDateTime.now());
        }

        if (request.getWorkStatus() == null || request.getWorkStatus().isBlank()) {
            request.setWorkStatus("HIRED");
        }

        return employmentRecordRepository.save(request);
    }

    public EmploymentRecordEntity getEmploymentRecordById(Integer employmentRecordId) {
        return employmentRecordRepository.findById(employmentRecordId)
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYMENT_RECORD_NOT_FOUND));
    }

    public List<EmploymentRecordEntity> getUserEmploymentHistory(Integer userId) {
        return employmentRecordRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<EmploymentRecordEntity> getStoreEmploymentHistory(Integer storeId) {
        return employmentRecordRepository.findAllByStoreIdOrderByCreatedAtDesc(storeId);
    }

    public boolean hasUserWorkedAtStore(Integer userId, Integer storeId, Integer jobPostId) {
        return employmentRecordRepository.existsByUserIdAndStoreIdAndJobPostId(userId, storeId, jobPostId);
    }
}