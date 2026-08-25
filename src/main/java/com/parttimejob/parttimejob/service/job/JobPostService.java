package com.parttimejob.parttimejob.service.job;

import com.parttimejob.parttimejob.dto.request.JobPostCreationRequest;
import com.parttimejob.parttimejob.dto.request.JobSearchRequest;
import com.parttimejob.parttimejob.dto.response.JobPostImageResponse;
import com.parttimejob.parttimejob.dto.response.JobPostResponse;
import com.parttimejob.parttimejob.dto.response.ShiftResponse;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import com.parttimejob.parttimejob.entity.job.JobCategoryEntity;
import com.parttimejob.parttimejob.entity.job.JobPostEntity;
import com.parttimejob.parttimejob.entity.job.WorkShiftEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.employer.EmployerRepository;
import com.parttimejob.parttimejob.repository.employer.StoreRepository;
import com.parttimejob.parttimejob.repository.job.JobCategoryRepository;
import com.parttimejob.parttimejob.repository.job.JobPostImageRepository;
import com.parttimejob.parttimejob.repository.job.JobPostRepository;
import com.parttimejob.parttimejob.repository.job.WorkShiftRepository;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class JobPostService {

    JobPostRepository jobPostRepository;
    EmployerRepository employerRepository;
    StoreRepository storeRepository;
    JobCategoryRepository jobCategoryRepository;
    WorkShiftRepository workShiftRepository;
    JobPostImageRepository jobPostImageRepository;

    public Page<JobPostResponse> getHomeJobs(int page, int size) {
        Specification<JobPostEntity> specification = (root, query, cb) ->
                cb.equal(root.get("status"), "ACTIVE");

        Page<JobPostEntity> jobPostEntities = jobPostRepository.findAll(
                specification,
                PageRequest.of(page, size, Sort.by("publishedAt").descending())
        );

        return mapPageWithDetails(jobPostEntities);
    }

    private JobPostResponse mapToJobPostResponse(JobPostEntity entity) {
        return mapToJobPostResponse(entity, Set.of(), Set.of(), new LinkedHashSet<>());
    }

    private JobPostResponse mapToJobPostResponse(
            JobPostEntity entity,
            Set<String> categories,
            Set<ShiftResponse> shifts,
            Set<JobPostImageResponse> images
    ) {
        StoreEntity store = entity.getStore();
        String fullAddress = buildFullAddress(store);

        return JobPostResponse.builder()
                .id(entity.getId())
                .storeId(entity.getStore().getId())
                .title(entity.getTitle())
                .jobDescription(entity.getJobDescription())
                .requirements(entity.getRequirements())
                .benefits(entity.getBenefits())
                .hourlyWageMin(entity.getHourlyWageMin())
                .hourlyWageMax(entity.getHourlyWageMax())
                .currency(entity.getCurrency())
                .vacancyCount(entity.getVacancyCount())
                .minAge(entity.getMinAge())
                .maxAge(entity.getMaxAge())
                .genderRequirement(entity.getGenderRequirement())
                .employmentType(entity.getEmploymentType())
                .status(entity.getStatus())
                .publishedAt(entity.getPublishedAt())
                .expiredAt(entity.getExpiredAt())

                .employerName(entity.getEmployer() != null ? entity.getEmployer().getCompanyName() : null)
                .storeName(store != null ? store.getStoreName() : null)
                .phoneContact(store != null ? store.getPhoneContact() : null)

                .city(store != null ? store.getCity() : null)
                .district(store != null ? store.getDistrict() : null)
                .ward(store != null ? store.getWard() : null)
                .streetAddress(store != null ? store.getStreetAddress() : null)
                .fullAddress(fullAddress)
                .latitude(store != null ? store.getLatitude() : null)
                .longitude(store != null ? store.getLongitude() : null)

                .categories(categories)
                .shifts(shifts)
                .images(images)
                .build();
    }

    private String buildFullAddress(StoreEntity store) {
        if (store == null) {
            return null;
        }

        return Stream.of(
                        store.getStreetAddress(),
                        store.getWard(),
                        store.getDistrict(),
                        store.getCity()
                )
                .filter(part -> part != null && !part.isBlank())
                .collect(Collectors.joining(", "));
    }

    public Page<JobPostResponse> searchJobs(JobSearchRequest request, int page, int size) {
        Specification<JobPostEntity> specification = (root, query, cb) -> {
            query.distinct(true);
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), "ACTIVE"));

            if (request.getTitle() != null && !request.getTitle().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("title")),
                                "%" + request.getTitle().trim().toLowerCase() + "%"
                        )
                );
            }

            if (request.getStoreName() != null && !request.getStoreName().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("store").get("storeName")),
                                "%" + request.getStoreName().trim().toLowerCase() + "%"
                        )
                );
            }

            if (request.getCity() != null && !request.getCity().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("store").get("city")),
                                "%" + request.getCity().trim().toLowerCase() + "%"
                        )
                );
            }

            if (request.getDistrict() != null && !request.getDistrict().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("store").get("district")),
                                "%" + request.getDistrict().trim().toLowerCase() + "%"
                        )
                );
            }

            if (request.getWard() != null && !request.getWard().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("store").get("ward")),
                                "%" + request.getWard().trim().toLowerCase() + "%"
                        )
                );
            }

            if (request.getStreetAddress() != null && !request.getStreetAddress().isBlank()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("store").get("streetAddress")),
                                "%" + request.getStreetAddress().trim().toLowerCase() + "%"
                        )
                );
            }

            if (request.getAddressKeyword() != null && !request.getAddressKeyword().isBlank()) {
                String keyword = "%" + request.getAddressKeyword().trim().toLowerCase() + "%";

                Predicate cityPredicate = cb.like(cb.lower(root.get("store").get("city")), keyword);
                Predicate districtPredicate = cb.like(cb.lower(root.get("store").get("district")), keyword);
                Predicate wardPredicate = cb.like(cb.lower(root.get("store").get("ward")), keyword);
                Predicate streetPredicate = cb.like(cb.lower(root.get("store").get("streetAddress")), keyword);

                predicates.add(cb.or(cityPredicate, districtPredicate, wardPredicate, streetPredicate));
            }

            if (request.getMinHourlyWage() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("hourlyWageMin"), request.getMinHourlyWage()));
            }

            if (request.getMaxHourlyWage() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("hourlyWageMax"), request.getMaxHourlyWage()));
            }

            if (request.getCategoryId() != null) {
                Join<JobPostEntity, JobCategoryEntity> categoryJoin = root.join("categories", JoinType.INNER);
                predicates.add(cb.equal(categoryJoin.get("id"), request.getCategoryId()));
            }

            if (request.getShiftId() != null) {
                Join<JobPostEntity, WorkShiftEntity> shiftJoin = root.join("shifts", JoinType.INNER);
                predicates.add(cb.equal(shiftJoin.get("id"), request.getShiftId()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedAt").descending());
        Page<JobPostEntity> entities = jobPostRepository.findAll(specification, pageable);

        return mapPageWithDetails(entities);
    }

    public JobPostResponse getJobPostById(Integer jobPostId) {
        return mapSingleJobPostResponse(jobPostId);
    }

    public JobPostResponse getJobDetail(Integer jobPostId) {
        return getJobPostById(jobPostId);
    }

    public JobPostResponse createJobPost(JobPostCreationRequest request) {
        EmployerEntity employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        StoreEntity store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        JobPostEntity jobPost = JobPostEntity.builder()
                .title(request.getTitle())
                .jobDescription(request.getJobDescription())
                .requirements(request.getRequirements())
                .benefits(request.getBenefits())
                .hourlyWageMin(request.getHourlyWageMin())
                .hourlyWageMax(request.getHourlyWageMax())
                .currency(request.getCurrency() != null ? request.getCurrency() : "VND")
                .vacancyCount(request.getVacancyCount())
                .minAge(request.getMinAge())
                .maxAge(request.getMaxAge())
                .genderRequirement(request.getGenderRequirement())
                .employmentType(request.getEmploymentType())
                .expiredAt(request.getExpiredAt())
                .status("ACTIVE")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .employer(employer)
                .store(store)
                .categories(new HashSet<>(jobCategoryRepository.findAllById(request.getCategoryIds())))
                .shifts(new HashSet<>(workShiftRepository.findAllById(request.getShiftIds())))
                .build();

        JobPostEntity saved = jobPostRepository.save(jobPost);
        return mapSingleJobPostResponse(saved.getId());
    }

    public JobPostResponse updateJobPost(Integer jobPostId, JobPostCreationRequest request) {
        JobPostEntity jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_FOUND));

        EmployerEntity employerEntity = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        StoreEntity store = storeRepository.findById(request.getStoreId())
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));

        jobPost.setEmployer(employerEntity);
        jobPost.setStore(store);
        jobPost.setTitle(request.getTitle());
        jobPost.setJobDescription(request.getJobDescription());
        jobPost.setRequirements(request.getRequirements());
        jobPost.setBenefits(request.getBenefits());
        jobPost.setHourlyWageMin(request.getHourlyWageMin());
        jobPost.setHourlyWageMax(request.getHourlyWageMax());
        jobPost.setCurrency(request.getCurrency());
        jobPost.setVacancyCount(request.getVacancyCount());
        jobPost.setMinAge(request.getMinAge());
        jobPost.setMaxAge(request.getMaxAge());
        jobPost.setGenderRequirement(request.getGenderRequirement());
        jobPost.setEmploymentType(request.getEmploymentType());
        jobPost.setExpiredAt(request.getExpiredAt());
        jobPost.setCategories(new HashSet<>(jobCategoryRepository.findAllById(request.getCategoryIds())));
        jobPost.setShifts(new HashSet<>(workShiftRepository.findAllById(request.getShiftIds())));
        jobPost.setUpdatedAt(LocalDateTime.now());

        if(jobPost.getVacancyCount() == 0){
            jobPost.setStatus("CLOSED");
        }else{
            jobPost.setStatus("ACTIVE");
        }

        JobPostEntity saved = jobPostRepository.save(jobPost);
        return mapSingleJobPostResponse(saved.getId());
    }

    public JobPostResponse activateJobPost(Integer jobPostId) {
        JobPostEntity jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_FOUND));

        jobPost.setStatus("ACTIVE");

        if (jobPost.getPublishedAt() == null) {
            jobPost.setPublishedAt(LocalDateTime.now());
        }

        jobPost.setUpdatedAt(LocalDateTime.now());
        JobPostEntity saved = jobPostRepository.save(jobPost);

        return mapSingleJobPostResponse(saved.getId());
    }

    public JobPostResponse pauseJobPost(Integer jobPostId) {
        JobPostEntity jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_FOUND));

        jobPost.setStatus("PAUSED");
        jobPost.setUpdatedAt(LocalDateTime.now());
        JobPostEntity saved = jobPostRepository.save(jobPost);

        return mapSingleJobPostResponse(saved.getId());
    }

    public JobPostResponse closeJobPost(Integer jobPostId) {
        JobPostEntity jobPost = jobPostRepository.findById(jobPostId)
                .orElseThrow(() -> new AppException(ErrorCode.JOB_POST_NOT_FOUND));

        jobPost.setStatus("CLOSED");
        jobPost.setUpdatedAt(LocalDateTime.now());
        JobPostEntity saved = jobPostRepository.save(jobPost);

        return mapSingleJobPostResponse(saved.getId());
    }

    public Page<JobPostResponse> getEmployerJobPosts(Integer employerId, int page, int size) {
        Specification<JobPostEntity> specification = (root, query, cb) ->
                cb.equal(root.get("employer").get("id"), employerId);

        var jobPostList = jobPostRepository.findAll(specification, PageRequest.of(page, size));
        return mapPageWithDetails(jobPostList);
    }

    public List<JobPostEntity> getLatestHomeJobs() {
        return jobPostRepository.findTop10ByStatusOrderByCreatedAtDesc("ACTIVE");
    }

    public List<JobPostResponse> getJobPostsByStoreId(Integer storeId) {
        List<JobPostEntity> jobPosts = jobPostRepository.findByStoreId(storeId);
        if (jobPosts.isEmpty()) {
            return List.of();
        }

        List<Integer> ids = jobPosts.stream().map(JobPostEntity::getId).toList();
        JobPostAssociations associations = loadJobPostAssociations(ids);

        return jobPosts.stream()
                .map(entity -> {
                    Integer id = entity.getId();
                    JobPostEntity hydrated = associations.jobPostsById().getOrDefault(id, entity);
                    return mapToJobPostResponse(
                            hydrated,
                            associations.categoryByJobPostId().getOrDefault(id, Set.of()),
                            associations.shiftByJobPostId().getOrDefault(id, Set.of()),
                            associations.imageByJobPostId().getOrDefault(id, new LinkedHashSet<>())
                    );
                })
                .toList();
    }

    public Long countJobPostsByEmployer(Integer employerId) {
        return jobPostRepository.countByEmployerIdAndStatus(employerId, "ACTIVE");
    }

    private Page<JobPostResponse> mapPageWithDetails(Page<JobPostEntity> pageEntities) {
        if (pageEntities.isEmpty()) {
            return pageEntities.map(this::mapToJobPostResponse);
        }

        List<Integer> ids = pageEntities.getContent().stream().map(JobPostEntity::getId).toList();
        JobPostAssociations associations = loadJobPostAssociations(ids);

        return pageEntities.map(entity -> {
            Integer id = entity.getId();
            JobPostEntity hydrated = associations.jobPostsById().getOrDefault(id, entity);
            return mapToJobPostResponse(
                    hydrated,
                    associations.categoryByJobPostId().getOrDefault(id, Set.of()),
                    associations.shiftByJobPostId().getOrDefault(id, Set.of()),
                    associations.imageByJobPostId().getOrDefault(id, new LinkedHashSet<>())
            );
        });
    }

    private JobPostResponse mapSingleJobPostResponse(Integer jobPostId) {
        JobPostAssociations associations = loadJobPostAssociations(List.of(jobPostId));
        JobPostEntity jobPost = associations.jobPostsById().get(jobPostId);
        if (jobPost == null) {
            throw new AppException(ErrorCode.JOB_POST_NOT_FOUND);
        }

        return mapToJobPostResponse(
                jobPost,
                associations.categoryByJobPostId().getOrDefault(jobPostId, Set.of()),
                associations.shiftByJobPostId().getOrDefault(jobPostId, Set.of()),
                associations.imageByJobPostId().getOrDefault(jobPostId, new LinkedHashSet<>())
        );
    }

    private JobPostAssociations loadJobPostAssociations(Collection<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return new JobPostAssociations(Map.of(), Map.of(), Map.of(), Map.of());
        }

        Map<Integer, JobPostEntity> jobPostsById = jobPostRepository.findAllWithStoreEmployerByIdIn(ids)
                .stream()
                .collect(Collectors.toMap(JobPostEntity::getId, entity -> entity, (left, right) -> left));

        Map<Integer, LinkedHashSet<String>> categoryMap = new HashMap<>();
        jobPostRepository.findCategoryViewsByJobPostIds(ids).forEach(view ->
                categoryMap.computeIfAbsent(view.getJobPostId(), ignored -> new LinkedHashSet<>())
                        .add(view.getCategoryName())
        );

        Map<Integer, LinkedHashSet<ShiftResponse>> shiftMap = new HashMap<>();
        jobPostRepository.findShiftViewsByJobPostIds(ids).forEach(view ->
                shiftMap.computeIfAbsent(view.getJobPostId(), ignored -> new LinkedHashSet<>())
                        .add(ShiftResponse.builder()
                                .shiftName(view.getShiftName())
                                .startTime(view.getStartTime())
                                .endTime(view.getEndTime())
                                .build())
        );

        Map<Integer, LinkedHashSet<JobPostImageResponse>> imageMap = new HashMap<>();
        jobPostRepository.findImageViewsByJobPostIds(ids).forEach(view ->
                imageMap.computeIfAbsent(view.getJobPostId(), ignored -> new LinkedHashSet<>())
                        .add(JobPostImageResponse.builder()
                                .imageUrl(view.getImageUrl())
                                .build())
        );

        return new JobPostAssociations(
                jobPostsById,
                toLinkedSetMap(categoryMap),
                toLinkedSetMap(shiftMap),
                toLinkedSetMap(imageMap)
        );
    }

    private <T> Map<Integer, Set<T>> toLinkedSetMap(Map<Integer, LinkedHashSet<T>> source) {
        return source.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> new LinkedHashSet<>(entry.getValue())));
    }

    private record JobPostAssociations(
            Map<Integer, JobPostEntity> jobPostsById,
            Map<Integer, Set<String>> categoryByJobPostId,
            Map<Integer, Set<ShiftResponse>> shiftByJobPostId,
            Map<Integer, Set<JobPostImageResponse>> imageByJobPostId
    ) {
    }
}
