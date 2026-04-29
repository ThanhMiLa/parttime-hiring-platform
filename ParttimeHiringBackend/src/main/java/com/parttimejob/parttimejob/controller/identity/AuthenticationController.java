package com.parttimejob.parttimejob.controller;


import com.nimbusds.jose.JOSEException;
import com.parttimejob.parttimejob.dto.request.*;
import com.parttimejob.parttimejob.dto.response.ApiResponse;
import com.parttimejob.parttimejob.dto.response.AuthenticationResponse;
import com.parttimejob.parttimejob.dto.response.IntrospectResponse;
import com.parttimejob.parttimejob.dto.response.UserResponse;
import com.parttimejob.parttimejob.service.identity.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.oauth2.jwt.Jwt;

import java.text.ParseException;
import java.time.Instant;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AuthenticationController {
    AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> authenticate(
            @RequestBody AuthenticationRequest authenticationRequest, HttpServletRequest request) {
        AuthenticationResponse result = authenticationService.login(authenticationRequest);
        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Success")
                .result(result)
                .timestamp(Instant.now().toString())
                .build());
    }

    @PostMapping("/introspect")
    public ResponseEntity<ApiResponse<IntrospectResponse>> introspect(
            @RequestBody IntrospectRequest introspectRequest, HttpServletRequest request)
            throws ParseException, JOSEException {
        IntrospectResponse result = authenticationService.introspect(introspectRequest);
        return ResponseEntity.ok(ApiResponse.<IntrospectResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Success")
                .result(result)
                .timestamp(Instant.now().toString())
                .build());
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestBody LogoutRequest logoutRequest, HttpServletRequest request) throws ParseException, JOSEException {
        authenticationService.logout(logoutRequest);
        return ResponseEntity.ok(ApiResponse.<Void>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Success")
                .result(null)
                .timestamp(Instant.now().toString())
                .build());
    }

    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> refresh(
            @RequestBody RefreshRequest refreshRequest, HttpServletRequest request)
            throws ParseException, JOSEException {
        AuthenticationResponse result = authenticationService.refresh(refreshRequest.getRefreshToken());
        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Success")
                .result(result)
                .timestamp(Instant.now().toString())
                .build());
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> register(
            @RequestBody @Valid RegisterRequest registerRequest, HttpServletRequest request){
        AuthenticationResponse result = authenticationService.register(registerRequest);

        return ResponseEntity.ok(ApiResponse.<AuthenticationResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Success")
                .result(result)
                .timestamp(Instant.now().toString())
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> myInfo(
            @AuthenticationPrincipal Jwt jwt,
            HttpServletRequest request)  {
        String username = jwt.getSubject();
        UserResponse result = authenticationService.myInfo(username);
        return ResponseEntity.ok(ApiResponse.<UserResponse>builder()
                .status(HttpStatus.OK.value())
                .code(1000)
                .message("Success")
                .result(result)
                .timestamp(Instant.now().toString())
                .build());
    }



}
