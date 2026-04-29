package com.parttimejob.parttimejob.service.application;

import com.parttimejob.parttimejob.dto.request.application.JobApplicationRequest;
import com.parttimejob.parttimejob.dto.response.JobApplicationResponse;
import com.parttimejob.parttimejob.entity.application.JobApplicationEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import com.parttimejob.parttimejob.entity.work.EmploymentRecordEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.application.JobApplicationRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import com.parttimejob.parttimejob.repository.job.JobPostRepository;
import com.parttimejob.parttimejob.repository.work.EmploymentRecordRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobApplicationService {

    JobApplicationRepository jobApplicationRepository;
    UserRepository userRepository;
    JobPostRepository jobPostRepository;
    EmploymentRecordRepository employmentRecordRepository;

    public JobApplicationResponse applyJob(Integer userId, JobApplicationRequest request) {
        boolean existed = jobApplicationRepository.existsByApplicantIdAndJobPostId(
                userId,
                request.getJobPostId()
        );

        if (existed) {
            throw new AppException(ErrorCode.JOB_ALREADY_APPLIED);
        }

        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        JobPostEntity jobPost = jobPostRepository.findById(request.getJobPostId())
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_FOUND));

        if (!"ACTIVE".equals(jobPost.getStatus())) {
            throw new AppException(ErrorCode.JOB_POST_NOT_ACTIVE);
        }

        JobApplicationEntity entity = JobApplicationEntity.builder()
                .jobPost(jobPost)
                .applicant(user)
                .contactPhone(request.getContactPhone())
                .note(request.getNote())
                .status("PENDING")
                .appliedAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        JobApplicationEntity savedEntity = jobApplicationRepository.save(entity);
        return mapToResponse(savedEntity);
    }

    public List<JobApplicationResponse> getMyApplications(Integer userId) {
        return jobApplicationRepository.findAllByApplicantIdOrderByAppliedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public List<JobApplicationResponse> getApplicationsByJobPost(Integer jobPostId) {
        return jobApplicationRepository.findAllByJobPostIdOrderByAppliedAtDesc(jobPostId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public JobApplicationResponse getApplicationDetail(Integer userId, Integer applicationId) {
        JobApplicationEntity application = jobApplicationRepository.findWithDetailsById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_APPLICATION_NOT_FOUND));

        if (!application.getApplicant().getId().equals(userId)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return mapToResponse(application);
    }

    public JobApplicationResponse updateApplicationStatus(Integer applicationId, String status) {
        JobApplicationEntity application = jobApplicationRepository.findWithDetailsById(applicationId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_APPLICATION_NOT_FOUND));

        application.setStatus(status);
        application.setUpdatedAt(LocalDateTime.now());

        JobApplicationEntity savedEntity = jobApplicationRepository.save(application);

        if("ACCEPTED".equals(status)){
            EmploymentRecordEntity employmentRecordEntity
                    = EmploymentRecordEntity.builder()
                    .user(application.getApplicant())
                    .store(application.getJobPost().getStore())
                    .application(application)
                    .jobPost(savedEntity.getJobPost())
                    .workStatus("HIRED")
                    .startDate(LocalDate.now())
                    .verifiedByEmployer(application.getJobPost().getEmployer())
                    .verifiedAt(LocalDateTime.now())
                    .createdAt(LocalDateTime.now())
                    .build();
            employmentRecordRepository.save(employmentRecordEntity);

            JobPostEntity jobPostEntity = application.getJobPost();
            int count = jobPostEntity.getVacancyCount() - 1;
            jobPostEntity.setVacancyCount(count);
            if(count == 0){
                jobPostEntity.setStatus("CLOSED");
            }
            jobPostRepository.save(jobPostEntity);
        }

        return mapToResponse(savedEntity);
    }

    public long countApplicationsByJobPost(Integer jobPostId) {
        return jobApplicationRepository.countByJobPostId(jobPostId);
    }

    public long countApplicationsByStore(Integer storeId) {
        return jobApplicationRepository.countByJobPost_StoreId(storeId);
    }

    public long countApplicationsByEmployer(Integer employerId) {
        return jobApplicationRepository.countByJobPost_Employer_IdAndStatus(employerId, "PENDING");
    }

    private JobApplicationResponse mapToResponse(JobApplicationEntity entity) {
        if (entity == null) return null;

        return JobApplicationResponse.builder()
                .id(entity.getId())

                .jobPostId(entity.getJobPost().getId())
                .jobTitle(entity.getJobPost().getTitle())
                .companyName(entity.getJobPost().getStore().getStoreName())

                .applicantId(entity.getApplicant().getId())
                .applicantFullName(entity.getApplicant().getDisplayName())

                .contactPhone(entity.getContactPhone())
                .note(entity.getNote())
                .status(entity.getStatus())
                .appliedAt(entity.getAppliedAt())
                .build();
    }
}
