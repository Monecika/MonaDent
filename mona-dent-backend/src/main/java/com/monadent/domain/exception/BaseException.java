package com.monadent.domain.exception;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {

    private final int status;
    private final ErrorCode errorCode;

    public BaseException(int status, ErrorCode errorCode) {
        super(errorCode.getMessageKey());
        this.status = status;
        this.errorCode = errorCode;
    }
}
