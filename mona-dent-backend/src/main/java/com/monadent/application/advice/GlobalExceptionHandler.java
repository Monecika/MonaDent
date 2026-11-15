package com.monadent.application.advice;

import com.monadent.contracts.auth.ErrorResponse;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.context.MessageSource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Locale;
import java.sql.SQLException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    private static final Pattern SIZE_MESSAGE = Pattern.compile("size must be between (\\d+) and (\\d+)");

    private final MessageSource messageSource;

    public GlobalExceptionHandler(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex, Locale locale) {
        return ResponseEntity.status(ex.getStatus())
                             .body(errorResponse(ex.getStatus(), ex.getErrorCode(), locale));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolation(
            DataIntegrityViolationException ex, Locale locale) {
        if (isUniqueConstraintViolation(ex)) {
            ErrorCode errorCode = duplicateErrorCode(ex);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(errorResponse(HttpStatus.CONFLICT.value(), errorCode, locale));
        }

        log.error("Database constraint rejected a request", ex);
        return ResponseEntity.internalServerError()
                             .body(errorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                                 ErrorCode.INTERNAL_SERVER_ERROR,
                                                 locale));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, Locale locale) {
        String message = ex.getBindingResult()
                           .getFieldErrors()
                           .stream()
                           .map(error -> validationMessage(error, locale))
                           .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
                             .body(errorResponse(HttpStatus.BAD_REQUEST.value(),
                                                 ErrorCode.VALIDATION_FAILED,
                                                 message,
                                                 locale));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableRequest(HttpMessageNotReadableException ex, Locale locale) {
        return ResponseEntity.badRequest()
                             .body(errorResponse(HttpStatus.BAD_REQUEST.value(), ErrorCode.INVALID_REQUEST, locale));
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotSupported(
            HttpRequestMethodNotSupportedException ex, Locale locale) {
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED)
                             .body(errorResponse(HttpStatus.METHOD_NOT_ALLOWED.value(),
                                                 ErrorCode.METHOD_NOT_ALLOWED,
                                                 locale));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedException(Exception ex, Locale locale) {
        if (isUniqueConstraintViolation(ex)) {
            ErrorCode errorCode = duplicateErrorCode(ex);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(errorResponse(HttpStatus.CONFLICT.value(), errorCode, locale));
        }
        log.error("Unhandled API exception", ex);

        return ResponseEntity.internalServerError()
                             .body(errorResponse(HttpStatus.INTERNAL_SERVER_ERROR.value(),
                                                 ErrorCode.INTERNAL_SERVER_ERROR,
                                                 locale));
    }

    private ErrorResponse errorResponse(int status, ErrorCode errorCode, Locale locale) {
        return errorResponse(status, errorCode, translate(errorCode.getMessageKey(), locale), locale);
    }

    private ErrorResponse errorResponse(int status, ErrorCode errorCode, String message, Locale locale) {
        return new ErrorResponse().status(status)
                                  .errorType(translate(errorCode.getErrorTypeKey(), locale))
                                  .message(message);
    }

    private String validationMessage(FieldError error, Locale locale) {
        String field = messageSource.getMessage("field." + error.getField(),
                                                null,
                                                error.getField(),
                                                effectiveLocale(locale));
        String code = error.getCode();
        int separator = code == null ? -1 : code.indexOf('.');
        String constraint = separator < 0 ? code : code.substring(0, separator);
        String message = switch (constraint == null ? "" : constraint) {
            case "NotBlank" -> translate("validation.not_blank", locale);
            case "NotNull" -> translate("validation.not_null", locale);
            case "Email" -> translate("validation.email", locale);
            case "Size" -> sizeMessage(error, locale);
            default -> error.getDefaultMessage();
        };
        return field + ": " + message;
    }

    private String sizeMessage(FieldError error, Locale locale) {
        String defaultMessage = error.getDefaultMessage();
        Matcher matcher = SIZE_MESSAGE.matcher(defaultMessage == null ? "" : defaultMessage);
        if (!matcher.matches()) {
            return defaultMessage == null ? "" : defaultMessage;
        }
        return messageSource.getMessage("validation.size",
                                        new Object[] {matcher.group(1), matcher.group(2)},
                                        effectiveLocale(locale));
    }

    private String translate(String key, Locale locale) {
        return messageSource.getMessage(key, null, effectiveLocale(locale));
    }

    private boolean isUniqueConstraintViolation(Throwable exception) {
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof SQLException sqlException && "23505".equals(sqlException.getSQLState())) {
                return true;
            }
        }
        return false;
    }

    private ErrorCode duplicateErrorCode(Throwable exception) {
        String constraintName = null;
        for (Throwable cause = exception; cause != null; cause = cause.getCause()) {
            if (cause instanceof ConstraintViolationException violation) {
                constraintName = violation.getConstraintName();
                break;
            }
        }
        String normalizedName = constraintName == null ? "" : constraintName.toLowerCase(Locale.ROOT);
        if (normalizedName.contains("users_email")) return ErrorCode.USER_ALREADY_EXISTS;
        if (normalizedName.contains("users_phone")) return ErrorCode.USER_PHONE_ALREADY_EXISTS;
        if (normalizedName.contains("ip_allowlist_entries_ip_address")) return ErrorCode.IP_ADDRESS_ALREADY_EXISTS;
        if (normalizedName.contains("patient_teeth_current_position")) return ErrorCode.DUPLICATE_PATIENT_TOOTH;
        return ErrorCode.DUPLICATE_VALUE;
    }

    private Locale effectiveLocale(Locale locale) {
        return locale == null ? Locale.forLanguageTag("ro") : locale;
    }

}
