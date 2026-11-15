package com.monadent.domain.exception;

public enum ErrorCode {
    INVALID_CREDENTIALS("error.type.authentication_failed", "error.authentication.invalid_credentials"),
    AUTHENTICATION_REQUIRED("error.type.authentication_failed", "error.authentication.required"),
    ACCESS_DENIED("error.type.access_denied", "error.authorization.denied"),
    IP_ADDRESS_NOT_ALLOWED("error.type.ip_address_not_allowed", "error.ip_address.not_allowed"),
    INVALID_IP_ADDRESS("error.type.invalid_ip_address", "error.ip_address.invalid"),
    IP_ADDRESS_ALREADY_EXISTS("error.type.ip_address_already_exists", "error.ip_address.already_exists"),
    IP_ADDRESS_NOT_FOUND("error.type.not_found", "error.ip_address.not_found"),
    LAST_IP_ADDRESS("error.type.last_ip_address", "error.ip_address.last_entry"),
    CURRENT_PASSWORD_INCORRECT("error.type.authentication_failed", "error.authentication.current_password_incorrect"),
    USER_NOT_FOUND("error.type.not_found", "error.user.not_found"),
    PATIENT_NOT_FOUND("error.type.not_found", "error.patient.not_found"),
    BRANCH_NOT_FOUND("error.type.not_found", "error.branch.not_found"),
    APPOINTMENT_NOT_FOUND("error.type.not_found", "error.appointment.not_found"),
    DOCTOR_NOT_FOUND("error.type.not_found", "error.doctor.not_found"),
    ASSIGNED_USER_NOT_FOUND("error.type.not_found", "error.assigned_user.not_found"),
    PATIENT_TOOTH_NOT_FOUND("error.type.not_found", "error.patient_tooth.not_found"),
    INVALID_BRANCH_UPDATE("error.type.invalid_branch_update", "error.branch.update_requires_name_or_address"),
    BRANCH_IN_USE("error.type.branch_in_use", "error.branch.cannot_delete_in_use"),
    DATE_OF_BIRTH_IN_FUTURE("error.type.invalid_date_of_birth", "error.patient.date_of_birth_in_future"),
    USER_ALREADY_EXISTS("error.type.user_already_exists", "error.user.email_already_exists"),
    USER_PHONE_ALREADY_EXISTS("error.type.user_phone_already_exists", "error.user.phone_already_exists"),
    DUPLICATE_VALUE("error.type.duplicate_value", "error.data.duplicate_value"),
    INVALID_PREFERRED_LANGUAGE("error.type.invalid_language", "error.user.invalid_preferred_language"),
    BRANCH_ASSIGNMENT_REQUIRED("error.type.invalid_branch", "error.branch.assignment_required"),
    SPECIFIED_BRANCH_NOT_FOUND("error.type.invalid_branch", "error.branch.specified_not_found"),
    ASSIGNED_USER_BRANCH_MISMATCH("error.type.invalid_user", "error.appointment.assigned_user_branch_mismatch"),
    DUPLICATE_PATIENT_TOOTH("error.type.duplicate_patient_tooth", "error.patient_tooth.duplicate_position"),
    INVALID_TOOTH_NUMBER("error.type.invalid_tooth", "error.patient_tooth.invalid_number_for_type"),
    INVALID_TOOTH_FINDINGS("error.type.invalid_tooth_findings", "error.patient_tooth.invalid_findings"),
    VALIDATION_FAILED("error.type.validation_failed", "error.validation.failed"),
    INVALID_REQUEST("error.type.invalid_request", "error.request.invalid"),
    METHOD_NOT_ALLOWED("error.type.method_not_allowed", "error.request.method_not_allowed"),
    INTERNAL_SERVER_ERROR("error.type.internal_server_error", "error.internal.unexpected");

    private final String errorTypeKey;
    private final String messageKey;

    ErrorCode(String errorTypeKey, String messageKey) {
        this.errorTypeKey = errorTypeKey;
        this.messageKey = messageKey;
    }

    public String getErrorTypeKey() {
        return errorTypeKey;
    }

    public String getMessageKey() {
        return messageKey;
    }
}
