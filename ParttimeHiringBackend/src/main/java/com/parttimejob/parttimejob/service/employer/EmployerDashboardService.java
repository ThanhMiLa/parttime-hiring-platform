package com.parttimejob.parttimejob.service.employer;

import com.parttimejob.parttimejob.entity.application.JobApplicationEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import com.parttimejob.parttimejob.repository.application.JobApplicationRepository;
import com.parttimejob.parttimejob.repository.job.JobPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployerDashboardService {

    private final JobPostRepository jobPostRepository;
    private final JobApplicationRepository jobApplicationRepository;

    public List<JobPostEntity> getEmployerJobs(Integer employerId) {
        return jobPostRepository.findTop20ByEmployerIdOrderByCreatedAtDesc(employerId);
    }

    public List<JobApplicationEntity> getJobApplicants(Integer jobPostId) {
        return jobApplicationRepository.findAllByJobPostIdOrderByAppliedAtDesc(jobPostId);
    }
}