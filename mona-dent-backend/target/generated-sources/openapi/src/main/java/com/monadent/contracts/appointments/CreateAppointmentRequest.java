package com.monadent.contracts.appointments;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
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
 * CreateAppointmentRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.689093+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class CreateAppointmentRequest {

  private UUID branchId;

  private UUID patientId;

  private UUID userId;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime appointmentDate;

  private Integer durationMinutes;

  private @Nullable String description;

  private @Nullable String notes;

  public CreateAppointmentRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public CreateAppointmentRequest(UUID branchId, UUID patientId, UUID userId, OffsetDateTime appointmentDate, Integer durationMinutes) {
    this.branchId = branchId;
    this.patientId = patientId;
    this.userId = userId;
    this.appointmentDate = appointmentDate;
    this.durationMinutes = durationMinutes;
  }

  public CreateAppointmentRequest branchId(UUID branchId) {
    this.branchId = branchId;
    return this;
  }

  /**
   * Get branchId
   * @return branchId
   */
  @NotNull @Valid 
  @JsonProperty("branchId")
  public UUID getBranchId() {
    return branchId;
  }

  public void setBranchId(UUID branchId) {
    this.branchId = branchId;
  }

  public CreateAppointmentRequest patientId(UUID patientId) {
    this.patientId = patientId;
    return this;
  }

  /**
   * Get patientId
   * @return patientId
   */
  @NotNull @Valid 
  @JsonProperty("patientId")
  public UUID getPatientId() {
    return patientId;
  }

  public void setPatientId(UUID patientId) {
    this.patientId = patientId;
  }

  public CreateAppointmentRequest userId(UUID userId) {
    this.userId = userId;
    return this;
  }

  /**
   * Get userId
   * @return userId
   */
  @NotNull @Valid 
  @JsonProperty("userId")
  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public CreateAppointmentRequest appointmentDate(OffsetDateTime appointmentDate) {
    this.appointmentDate = appointmentDate;
    return this;
  }

  /**
   * Get appointmentDate
   * @return appointmentDate
   */
  @NotNull @Valid 
  @JsonProperty("appointmentDate")
  public OffsetDateTime getAppointmentDate() {
    return appointmentDate;
  }

  public void setAppointmentDate(OffsetDateTime appointmentDate) {
    this.appointmentDate = appointmentDate;
  }

  public CreateAppointmentRequest durationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
    return this;
  }

  /**
   * Get durationMinutes
   * minimum: 1
   * @return durationMinutes
   */
  @NotNull @Min(1) 
  @JsonProperty("durationMinutes")
  public Integer getDurationMinutes() {
    return durationMinutes;
  }

  public void setDurationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
  }

  public CreateAppointmentRequest description(@Nullable String description) {
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

  public CreateAppointmentRequest notes(@Nullable String notes) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    CreateAppointmentRequest createAppointmentRequest = (CreateAppointmentRequest) o;
    return Objects.equals(this.branchId, createAppointmentRequest.branchId) &&
        Objects.equals(this.patientId, createAppointmentRequest.patientId) &&
        Objects.equals(this.userId, createAppointmentRequest.userId) &&
        Objects.equals(this.appointmentDate, createAppointmentRequest.appointmentDate) &&
        Objects.equals(this.durationMinutes, createAppointmentRequest.durationMinutes) &&
        Objects.equals(this.description, createAppointmentRequest.description) &&
        Objects.equals(this.notes, createAppointmentRequest.notes);
  }

  @Override
  public int hashCode() {
    return Objects.hash(branchId, patientId, userId, appointmentDate, durationMinutes, description, notes);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class CreateAppointmentRequest {\n");
    sb.append("    branchId: ").append(toIndentedString(branchId)).append("\n");
    sb.append("    patientId: ").append(toIndentedString(patientId)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    appointmentDate: ").append(toIndentedString(appointmentDate)).append("\n");
    sb.append("    durationMinutes: ").append(toIndentedString(durationMinutes)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    notes: ").append(toIndentedString(notes)).append("\n");
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

