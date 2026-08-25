package com.parttimejob.parttimejob.service.identity;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.parttimejob.parttimejob.dto.request.AuthenticationRequest;
import com.parttimejob.parttimejob.dto.request.IntrospectRequest;
import com.parttimejob.parttimejob.dto.request.LogoutRequest;
import com.parttimejob.parttimejob.dto.request.RegisterRequest;
import com.parttimejob.parttimejob.dto.response.AuthenticationResponse;
import com.parttimejob.parttimejob.dto.response.IntrospectResponse;
import com.parttimejob.parttimejob.dto.response.UserResponse;
import com.parttimejob.parttimejob.entity.identity.InvalidatedTokenEntity;
import com.parttimejob.parttimejob.entity.identity.RoleEntity;
import com.parttimejob.parttimejob.entity.identity.UserEntity;
import com.parttimejob.parttimejob.exception.AppException;
import com.parttimejob.parttimejob.exception.ErrorCode;
import com.parttimejob.parttimejob.mapper.UserMapper;
import com.parttimejob.parttimejob.repository.identity.InvalidatedTokenRepository;
import com.parttimejob.parttimejob.repository.identity.RoleRepository;
import com.parttimejob.parttimejob.repository.identity.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationService {

    UserRepository userRepository;
    PasswordEncoder passwordEncoder;
    InvalidatedTokenRepository invalidatedTokenRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected long REFRESHABLE_DURATION;

    public AuthenticationResponse login(AuthenticationRequest request) {
        UserEntity userEntity = userRepository
                .findWithRolesAndPermissionsByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.LOGIN_FAILED));
        boolean authenticated = passwordEncoder.matches(request.getPassword(), userEntity.getPassword());
        if (!authenticated) {
            throw new AppException(ErrorCode.LOGIN_FAILED);
        }

        var accessToken = generateToken(userEntity, false);
        var refreshToken = generateToken(userEntity, true);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .displayName(userEntity.getDisplayName())
                .username(userEntity.getUsername())
                .dob(userEntity.getDob())
                .id(userEntity.getId())
                .build();
    }

    public IntrospectResponse introspect(IntrospectRequest request) throws JOSEException, ParseException {
        String token = request.getToken();
        SignedJWT signedJWT = verifyToken(token, false);
        return IntrospectResponse.builder().valid(true).build();
    }

    public AuthenticationResponse refresh(String token) throws ParseException, JOSEException {
        SignedJWT signedJWT = verifyToken(token, true);

        String jti = signedJWT.getJWTClaimsSet().getJWTID();
        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidatedTokenEntity invalidatedToken = InvalidatedTokenEntity
                .builder()
                .id(jti)
                .expiryTime(expiryTime)
                .build();

        invalidatedTokenRepository.save(invalidatedToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();
        UserEntity userEntity = userRepository.findWithRolesAndPermissionsByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        var accessToken = generateToken(userEntity, false);
        var refreshToken = generateToken(userEntity, true);

        return AuthenticationResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .displayName(userEntity.getDisplayName())
                .username(userEntity.getUsername())
                .dob(userEntity.getDob())
                .id(userEntity.getId())
                .build();
    }

    public void logout(LogoutRequest logoutRequest){
        if(logoutRequest.getAccessToken() != null && !logoutRequest.getAccessToken().isBlank()){
            processTokenInvalidation(logoutRequest.getAccessToken(), "ACCESS");
        }

        if(logoutRequest.getRefreshToken() != null && logoutRequest.getRefreshToken().isBlank()){
            processTokenInvalidation(logoutRequest.getRefreshToken(), "REFRESH");
        }
    }

    private void processTokenInvalidation(String token, String type) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);

            String jit = signedJWT.getJWTClaimsSet().getJWTID();
            Date expriteDate = signedJWT.getJWTClaimsSet().getExpirationTime();

            InvalidatedTokenEntity invalidatedToken = InvalidatedTokenEntity
                    .builder()
                    .expiryTime(expriteDate)
                    .id(jit)
                    .build();

            invalidatedTokenRepository.save(invalidatedToken);
            log.info("{} logged out and blacklisted", type);

        } catch (ParseException e) {
            log.warn("Invalid {} format, skipping blacklist: {}", type, e.getMessage());
        }catch (Exception exception){
            log.error("Error blacklisting {}: {}", type, exception.getMessage());
        }
    }

    public AuthenticationResponse register(RegisterRequest registerRequest){
        if(userRepository.existsByUsername(registerRequest.getUsername())){
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        if(!Objects.equals(registerRequest.getPassword(), registerRequest.getConfirmPassword())){
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        UserEntity userEntity = userMapper.toUserEntity(registerRequest);
        userEntity.setPassword(passwordEncoder.encode(registerRequest.getPassword()));

        Set<RoleEntity> roles = new HashSet<>();
        RoleEntity role = roleRepository.findById("USER").orElseGet(() ->{
            RoleEntity roleEntity = RoleEntity.builder()
                    .name("USER")
                    .description("Regular user looking for part-time jobs")
                    .build();
            return roleRepository.save(roleEntity);
        });
        roles.add(role);
        userEntity.setRoles(roles);
        userEntity = userRepository.save(userEntity);

        AuthenticationRequest authenticationRequest = AuthenticationRequest.builder()
                .username(registerRequest.getUsername())
                .password(registerRequest.getPassword())
                .build();

        return login(authenticationRequest);

    }

    public UserResponse myInfo(String username)  {

        UserEntity userEntity = userRepository.findByUsername(username)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        return userMapper.toUserResponse(userEntity);

    }

    private SignedJWT verifyToken(String token, boolean isRefresh) throws JOSEException, ParseException {

        if(Objects.isNull(token) || token.isBlank()){
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        JWSVerifier jwsVerifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        boolean verified = signedJWT.verify(jwsVerifier);

        if (!verified) throw new AppException(ErrorCode.UNAUTHENTICATED);
        else if (expiryTime.before(new Date())) throw new AppException(ErrorCode.TOKEN_EXPIRED);

        if (invalidatedTokenRepository.existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        String expectedType = isRefresh ? "REFRESH" : "ACCESS";
        Object type = signedJWT.getJWTClaimsSet().getClaim("type");
        if(type == null || !expectedType.equals(type))
            throw new AppException(ErrorCode.TOKEN_INVALID);

        return signedJWT;
    }

    private String generateToken(UserEntity userEntity, boolean isRefresh) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(userEntity.getUsername())
                .issuer("codecamp.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(isRefresh ? REFRESHABLE_DURATION : VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(userEntity))
                .claim("type", isRefresh ? "REFRESH" : "ACCESS")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot create token!");
            throw new RuntimeException(e);
        }
    }

    private String buildScope(UserEntity userEntity) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(userEntity.getRoles())) {
            userEntity.getRoles().forEach(role -> {
                stringJoiner.add("ROLE_" + role.getName());
                if (!role.getPermissions().isEmpty()) {
                    role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
                }
            });
        }
        return stringJoiner.toString();
    }

}
