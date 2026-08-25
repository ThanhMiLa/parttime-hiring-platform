package com.parttimejob.parttimejob.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
@AllArgsConstructor
public enum ErrorCode {
    USER_EXISTED(1001, "User already existed", HttpStatus.CONFLICT),
    USER_NOT_EXISTED(1002, "User does not existed", HttpStatus.NOT_FOUND),
    USERNAME_INVALID(1003, "Username must be at least 4 chars", HttpStatus.BAD_REQUEST),
    PASSWORD_INVALID(1004, "Password must be at least 4 chars", HttpStatus.BAD_REQUEST),
    CONFIRM_PASSWORD_INVALID(1005, "Confirm password must be at least 4 chars", HttpStatus.BAD_REQUEST),
    PASSWORD_NOT_MATCH(1006, "Password and confirm password not match", HttpStatus.BAD_REQUEST),

    LOGIN_FAILED(2001, "Username or password incorrect", HttpStatus.UNAUTHORIZED),
    UNAUTHENTICATED(2002, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID(2003, "Token invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(2004, "Token expired", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2005, "You do not have permission", HttpStatus.FORBIDDEN),

    JOB_CATEGORY_NOT_FOUND(3001, "Job category not found", HttpStatus.NOT_FOUND),
    JOB_CATEGORY_NAME_EXISTED(3002, "Job category name already existed", HttpStatus.CONFLICT),
    JOB_CATEGORY_SLUG_EXISTED(3003, "Job category slug already existed", HttpStatus.CONFLICT),

    WORK_SHIFT_NOT_FOUND(3101, "Work shift not found", HttpStatus.NOT_FOUND),
    WORK_SHIFT_NAME_EXISTED(3102, "Work shift name already existed", HttpStatus.CONFLICT),

    EMPLOYER_NOT_FOUND(3201, "Employer not found", HttpStatus.NOT_FOUND),
    EMPLOYER_ALREADY_EXISTED(3202, "Employer already existed", HttpStatus.CONFLICT),
    EMPLOYER_NOT_ACTIVE(3203, "Employer is not active", HttpStatus.FORBIDDEN),

    STORE_NOT_FOUND(3301, "Store not found", HttpStatus.NOT_FOUND),
    STORE_NAME_EXISTED(3302, "Store name already existed for this employer", HttpStatus.CONFLICT),
    STORE_EMPLOYER_REQUIRED(3303, "Employer is required for store", HttpStatus.BAD_REQUEST),

    JOB_POST_NOT_FOUND(3401, "Job post not found", HttpStatus.NOT_FOUND),
    JOB_POST_NOT_ACTIVE(3402, "Job post is not active", HttpStatus.BAD_REQUEST),

    JOB_APPLICATION_NOT_FOUND(3501, "Job application not found", HttpStatus.NOT_FOUND),
    JOB_ALREADY_APPLIED(3502, "You already applied this job", HttpStatus.CONFLICT),

    EMPLOYMENT_RECORD_NOT_FOUND(3601, "Employment record not found", HttpStatus.NOT_FOUND),

    STORE_REVIEW_NOT_FOUND(3701, "Store review not found", HttpStatus.NOT_FOUND),
    STORE_REVIEW_ALREADY_EXISTED(3702, "This employment record has already been reviewed", HttpStatus.CONFLICT),
    STORE_REVIEW_FORBIDDEN(3703, "You have not worked at this store, cannot review", HttpStatus.FORBIDDEN),
    STORE_REVIEW_INVALID_RECORD(3704, "Employment record does not belong to this user or store", HttpStatus.BAD_REQUEST);

    private final int code;
    private final String message;
    private final HttpStatus httpStatus;
}