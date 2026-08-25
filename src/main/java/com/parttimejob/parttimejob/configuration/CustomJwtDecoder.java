package com.parttimejob.parttimejob.configuration;

import com.parttimejob.parttimejob.dto.request.IntrospectRequest;
import com.parttimejob.parttimejob.dto.response.IntrospectResponse;
import com.parttimejob.parttimejob.service.identity.AuthenticationService;
import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtException;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

import javax.crypto.spec.SecretKeySpec;
import java.util.Objects;

@Slf4j
@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CustomJwtDecoder implements JwtDecoder {

    @Autowired
    @Lazy
    AuthenticationService authenticationService;

    NimbusJwtDecoder nimbusJwtDecoder;

    @Value("${jwt.signerKey}")
    String signerKey;

    @Override
    public Jwt decode(String token) throws JwtException {

        try {
            IntrospectResponse introspectResponse = authenticationService.introspect(
                    IntrospectRequest.builder().token(token).build());
            boolean isValid = introspectResponse.isValid();
            if (!isValid) {
                throw new BadCredentialsException("Token invalid");
            }
        } catch (Exception exception) {
            throw new BadCredentialsException(exception.getMessage());
        }

        if (Objects.isNull(nimbusJwtDecoder)) {
            SecretKeySpec secretKeySpec = new SecretKeySpec(signerKey.getBytes(), "HS512");
            nimbusJwtDecoder = NimbusJwtDecoder.withSecretKey(secretKeySpec)
                    .macAlgorithm(MacAlgorithm.HS512)
                    .build();
        }

        return nimbusJwtDecoder.decode(token);
    }
}
