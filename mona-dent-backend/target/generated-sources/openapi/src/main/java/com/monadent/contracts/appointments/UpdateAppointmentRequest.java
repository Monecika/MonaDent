package com.monadent.contracts.appointments;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.appointments.AppointmentStatus;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * UpdateAppointmentRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.689093+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class UpdateAppointmentRequest {

  private @Nullable UUID patientId;

  private @Nullable UUID userId;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime appointmentDate;

  private @Nullable Integer durationMinutes;

  private @Nullable String description;

  private @Nullable String notes;

  private @Nullable AppointmentStatus status;

  public UpdateAppointmentRequest patientId(@Nullable UUID patientId) {
    this.patientId = patientId;
    return this;
  }

  /**
   * Get patientId
   * @return patientId
   */
  @Valid 
  @JsonProperty("patientId")
  public @Nullable UUID getPatientId() {
    return patientId;
  }

  public void setPatientId(@Nullable UUID patientId) {
    this.patientId = patientId;
  }

  public UpdateAppointmentRequest userId(@Nullable UUID userId) {
    this.userId = userId;
    return this;
  }

  /**
   * Get userId
   * @return userId
   */
  @Valid 
  @JsonProperty("userId")
  public @Nullable UUID getUserId() {
    return userId;
  }

  public void setUserId(@Nullable UUID userId) {
    this.userId = userId;
  }

  public UpdateAppointmentRequest appointmentDate(@Nullable OffsetDateTime appointmentDate) {
    this.appointmentDate = appointmentDate;
    return this;
  }

  /**
   * Get appointmentDate
   * @return appointmentDate
   */
  @Valid 
  @JsonProperty("appointmentDate")
  public @Nullable OffsetDateTime getAppointmentDate() {
    return appointmentDate;
  }

  public void setAppointmentDate(@Nullable OffsetDateTime appointmentDate) {
    this.appointmentDate = appointmentDate;
  }

  public UpdateAppointmentRequest durationMinutes(@Nullable Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
    return this;
  }

  /**
   * Get durationMinutes
   * minimum: 1
   * @return durationMinutes
   */
  @Min(1) 
  @JsonProperty("durationMinutes")
  public @Nullable Integer getDurationMinutes() {
    return durationMinutes;
  }

  public void setDurationMinutes(@Nullable Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
  }

  public UpdateAppointmentRequest description(@Nullable String description) {
    this.description = description;
    return this;
  }

  /**
   * Get description
   * @return description
   */
  
  @JsonProperty("description")
  public @Nullable String getDescription() {
    return description;
  }

  public void setDescription(@Nullable String description) {
    this.description = description;
  }

  public UpdateAppointmentRequest notes(@Nullable String notes) {
    this.notes = notes;
    return this;
  }

  /**
   * Get notes
   * @return notes
   */
  
  @JsonProperty("notes")
  public @Nullable String getNotes() {
    return notes;
  }

  public void setNotes(@Nullable String notes) {
    this.notes = notes;
  }

  public UpdateAppointmentRequest status(@Nullable AppointmentStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @Valid 
  @JsonProperty("status")
  public @Nullable AppointmentStatus getStatus() {
    return status;
  }

  public void setStatus(@Nullable AppointmentStatus status) {
    this.status = status;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UpdateAppointmentRequest updateAppointmentRequest = (UpdateAppointmentRequest) o;
    return Objects.equals(this.patientId, updateAppointmentRequest.patientId) &&
        Objects.equals(this.userId, updateAppointmentRequest.userId) &&
        Objects.equals(this.appointmentDate, updateAppointmentRequest.appointmentDate) &&
        Objects.equals(this.durationMinutes, updateAppointmentRequest.durationMinutes) &&
        Objects.equals(this.description, updateAppointmentRequest.description) &&
        Objects.equals(this.notes, updateAppointmentRequest.notes) &&
        Objects.equals(this.status, updateAppointmentRequest.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(patientId, userId, appointmentDate, durationMinutes, description, notes, status);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UpdateAppointmentRequest {\n");
    sb.append("    patientId: ").append(toIndentedString(patientId)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    appointmentDate: ").append(toIndentedString(appointmentDate)).append("\n");
    sb.append("    durationMinutes: ").append(toIndentedString(durationMinutes)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    notes: ").append(toIndentedString(notes)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("}");
    return sb.toString();
  }

  /**
   * Convert the given object to string with each line indented by 4 spaces
   * (except the first line).
   */
  private String toIndentedString(Object o) {
    if (o == null) {
      return "null";
    }
    return o.toString().replace("\n", "\n    ");
  }
}

