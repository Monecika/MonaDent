package com.monadent.contracts.visits;

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
 * CreateVisitRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.788713+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class CreateVisitRequest {

  private UUID branchId;

  private UUID patientId;

  private UUID doctorId;

  private @Nullable UUID appointmentId = null;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime visitDate;

  private Integer durationMinutes = 5;

  private @Nullable String description;

  private @Nullable String notes;

  public CreateVisitRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public CreateVisitRequest(UUID branchId, UUID patientId, UUID doctorId, OffsetDateTime visitDate) {
    this.branchId = branchId;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.visitDate = visitDate;
  }

  public CreateVisitRequest branchId(UUID branchId) {
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

  public CreateVisitRequest patientId(UUID patientId) {
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

  public CreateVisitRequest doctorId(UUID doctorId) {
    this.doctorId = doctorId;
    return this;
  }

  /**
   * Get doctorId
   * @return doctorId
   */
  @NotNull @Valid 
  @JsonProperty("doctorId")
  public UUID getDoctorId() {
    return doctorId;
  }

  public void setDoctorId(UUID doctorId) {
    this.doctorId = doctorId;
  }

  public CreateVisitRequest appointmentId(@Nullable UUID appointmentId) {
    this.appointmentId = appointmentId;
    return this;
  }

  /**
   * Get appointmentId
   * @return appointmentId
   */
  @Valid 
  @JsonProperty("appointmentId")
  public @Nullable UUID getAppointmentId() {
    return appointmentId;
  }

  public void setAppointmentId(@Nullable UUID appointmentId) {
    this.appointmentId = appointmentId;
  }

  public CreateVisitRequest visitDate(OffsetDateTime visitDate) {
    this.visitDate = visitDate;
    return this;
  }

  /**
   * Get visitDate
   * @return visitDate
   */
  @NotNull @Valid 
  @JsonProperty("visitDate")
  public OffsetDateTime getVisitDate() {
    return visitDate;
  }

  public void setVisitDate(OffsetDateTime visitDate) {
    this.visitDate = visitDate;
  }

  public CreateVisitRequest durationMinutes(Integer durationMinutes) {
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
  public Integer getDurationMinutes() {
    return durationMinutes;
  }

  public void setDurationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
  }

  public CreateVisitRequest description(@Nullable String description) {
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

  public CreateVisitRequest notes(@Nullable String notes) {
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
    CreateVisitRequest createVisitRequest = (CreateVisitRequest) o;
    return Objects.equals(this.branchId, createVisitRequest.branchId) &&
        Objects.equals(this.patientId, createVisitRequest.patientId) &&
        Objects.equals(this.doctorId, createVisitRequest.doctorId) &&
        Objects.equals(this.appointmentId, createVisitRequest.appointmentId) &&
        Objects.equals(this.visitDate, createVisitRequest.visitDate) &&
        Objects.equals(this.durationMinutes, createVisitRequest.durationMinutes) &&
        Objects.equals(this.description, createVisitRequest.description) &&
        Objects.equals(this.notes, createVisitRequest.notes);
  }

  @Override
  public int hashCode() {
    return Objects.hash(branchId, patientId, doctorId, appointmentId, visitDate, durationMinutes, description, notes);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class CreateVisitRequest {\n");
    sb.append("    branchId: ").append(toIndentedString(branchId)).append("\n");
    sb.append("    patientId: ").append(toIndentedString(patientId)).append("\n");
    sb.append("    doctorId: ").append(toIndentedString(doctorId)).append("\n");
    sb.append("    appointmentId: ").append(toIndentedString(appointmentId)).append("\n");
    sb.append("    visitDate: ").append(toIndentedString(visitDate)).append("\n");
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

