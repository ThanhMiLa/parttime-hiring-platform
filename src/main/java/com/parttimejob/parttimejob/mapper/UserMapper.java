package com.parttimejob.parttimejob.mapper;



import com.parttimejob.parttimejob.dto.request.RegisterRequest;
import com.parttimejob.parttimejob.dto.response.UserResponse;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", ignore = true)
    UserEntity toUserEntity(RegisterRequest registerRequest);

    UserResponse toUserResponse(UserEntity userEntity);
}
