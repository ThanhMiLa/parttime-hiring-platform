package com.parttimejob.parttimejob.mapper;

import com.parttimejob.parttimejob.dto.request.RegisterRequest;
import com.parttimejob.parttimejob.dto.response.PermissionResponse;
import com.parttimejob.parttimejob.dto.response.RoleResponse;
import com.parttimejob.parttimejob.dto.response.UserResponse;
import com.parttimejob.parttimejob.entity.identity.PermissionEntity;
import com.parttimejob.parttimejob.entity.identity.RoleEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import java.util.LinkedHashSet;
import java.util.Set;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-07-29T10:23:02+0700",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserEntity toUserEntity(RegisterRequest registerRequest) {
        if ( registerRequest == null ) {
            return null;
        }

        UserEntity.UserEntityBuilder userEntity = UserEntity.builder();

        userEntity.displayName( registerRequest.getDisplayName() );
        userEntity.dob( registerRequest.getDob() );
        userEntity.username( registerRequest.getUsername() );

        return userEntity.build();
    }

    @Override
    public UserResponse toUserResponse(UserEntity userEntity) {
        if ( userEntity == null ) {
            return null;
        }

        UserResponse.UserResponseBuilder userResponse = UserResponse.builder();

        userResponse.displayName( userEntity.getDisplayName() );
        userResponse.dob( userEntity.getDob() );
        userResponse.id( userEntity.getId() );
        userResponse.roles( roleEntitySetToRoleResponseSet( userEntity.getRoles() ) );
        userResponse.username( userEntity.getUsername() );

        return userResponse.build();
    }

    protected PermissionResponse permissionEntityToPermissionResponse(PermissionEntity permissionEntity) {
        if ( permissionEntity == null ) {
            return null;
        }

        PermissionResponse.PermissionResponseBuilder permissionResponse = PermissionResponse.builder();

        permissionResponse.description( permissionEntity.getDescription() );
        permissionResponse.name( permissionEntity.getName() );

        return permissionResponse.build();
    }

    protected Set<PermissionResponse> permissionEntitySetToPermissionResponseSet(Set<PermissionEntity> set) {
        if ( set == null ) {
            return null;
        }

        Set<PermissionResponse> set1 = new LinkedHashSet<PermissionResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( PermissionEntity permissionEntity : set ) {
            set1.add( permissionEntityToPermissionResponse( permissionEntity ) );
        }

        return set1;
    }

    protected RoleResponse roleEntityToRoleResponse(RoleEntity roleEntity) {
        if ( roleEntity == null ) {
            return null;
        }

        RoleResponse.RoleResponseBuilder roleResponse = RoleResponse.builder();

        roleResponse.description( roleEntity.getDescription() );
        roleResponse.name( roleEntity.getName() );
        roleResponse.permissions( permissionEntitySetToPermissionResponseSet( roleEntity.getPermissions() ) );

        return roleResponse.build();
    }

    protected Set<RoleResponse> roleEntitySetToRoleResponseSet(Set<RoleEntity> set) {
        if ( set == null ) {
            return null;
        }

        Set<RoleResponse> set1 = new LinkedHashSet<RoleResponse>( Math.max( (int) ( set.size() / .75f ) + 1, 16 ) );
        for ( RoleEntity roleEntity : set ) {
            set1.add( roleEntityToRoleResponse( roleEntity ) );
        }

        return set1;
    }
}
