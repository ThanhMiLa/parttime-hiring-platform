package com.parttimejob.parttimejob.service.job;

import com.parttimejob.parttimejob.dto.request.StoreCreationRequest;
import com.parttimejob.parttimejob.dto.response.StoreResponse;
import com.parttimejob.parttimejob.entity.employer.EmployerEntity;
import com.parttimejob.parttimejob.entity.employer.StoreEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.repository.employer.EmployerRepository;
import com.parttimejob.parttimejob.repository.employer.StoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class StoreService {
    private final StoreRepository storeRepository;
    private final EmployerRepository employerRepository;

    public StoreResponse getStoreById(Integer storeId) {
        var storeEntity = storeRepository.findWithEmployerById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        return mapToStoreResponse(storeEntity);
    }

    public List<StoreResponse> getStoresByEmployer(Integer employerId) {
        var storeRepoList = storeRepository.findAllByEmployerIdOrderByCreatedAtDesc(employerId);
        return storeRepoList.stream().map(this::mapToStoreResponse).toList();
    }

    public Page<StoreEntity> getStoresByEmployer(Integer employerId, int page, int size) {
        return storeRepository.findAllByEmployerId(employerId, PageRequest.of(page, size));
    }

    public List<StoreEntity> getAllActiveStores() {
        return storeRepository.findAllByIsActiveTrueOrderByCreatedAtDesc();
    }

    public StoreResponse createStore(StoreCreationRequest request) {
        EmployerEntity employer = employerRepository.findById(request.getEmployerId())
                .orElseThrow(() -> new AppException(ErrorCode.EMPLOYER_NOT_FOUND));
        StoreEntity store = StoreEntity.builder().storeName(request.getStoreName())
                .phoneContact(request.getPhoneContact()).description(request.getDescription()).city(request.getCity())
                .district(request.getDistrict()).ward(request.getWard()).streetAddress(request.getStreetAddress())
                .latitude(request.getLatitude()).longitude(request.getLongitude()).employer(employer).isActive(true)
                .createdAt(LocalDateTime.now()).updatedAt(LocalDateTime.now()).build();
        return mapToStoreResponse(storeRepository.save(store));
    }

    public StoreResponse updateStore(Integer storeId, StoreCreationRequest request) {
        StoreEntity store = storeRepository.findById(storeId)
                .orElseThrow(() -> new RuntimeException("Store không tồn tại với ID: " + storeId));
        store.setStoreName(request.getStoreName());
        store.setPhoneContact(request.getPhoneContact());
        store.setDescription(request.getDescription());
        store.setCity(request.getCity());
        store.setDistrict(request.getDistrict());
        store.setWard(request.getWard());
        store.setStreetAddress(request.getStreetAddress());
        store.setLatitude(request.getLatitude());
        store.setLongitude(request.getLongitude());
        if (request.getEmployerId() != null) {
            EmployerEntity employer = employerRepository.findById(request.getEmployerId())
                    .orElseThrow(() -> new RuntimeException("Employer không tồn tại"));
            store.setEmployer(employer);
        }
        store.setUpdatedAt(LocalDateTime.now());
        return mapToStoreResponse(storeRepository.save(store));
    }

    public void toggleStoreActive(Integer storeId) {
        StoreEntity store = storeRepository.findById(storeId)
                .orElseThrow(() -> new AppException(ErrorCode.STORE_NOT_FOUND));
        store.setIsActive(!store.getIsActive());
        storeRepository.save(store);
    }

    public Long countStoresByEmployer(Integer employerId) {
        return storeRepository.countByEmployerId(employerId);
    }

    private StoreResponse mapToStoreResponse(StoreEntity entity) {
        if (entity == null)
            return null;
        String fullAddress = Stream
                .of(entity.getStreetAddress(), entity.getWard(), entity.getDistrict(), entity.getCity())
                .filter(part -> part != null && !part.isBlank()).collect(Collectors.joining(", "));
        return StoreResponse.builder().id(entity.getId()).storeName(entity.getStoreName())
                .phoneContact(entity.getPhoneContact()).description(entity.getDescription()).city(entity.getCity())
                .district(entity.getDistrict()).ward(entity.getWard()).streetAddress(entity.getStreetAddress())
                .fullAddress(fullAddress).latitude(entity.getLatitude()).longitude(entity.getLongitude())
                .isActive(entity.getIsActive()).employerId(entity.getEmployer().getId())
                .employerName(entity.getEmployer().getCompanyName()).build();
    }
}
