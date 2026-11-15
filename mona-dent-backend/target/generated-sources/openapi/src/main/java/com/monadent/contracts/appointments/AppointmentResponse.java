package com.monadent.contracts.appointments;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.appointments.AppointmentEmployee;
import com.monadent.contracts.appointments.AppointmentPatient;
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
 * AppointmentResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.689093+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class AppointmentResponse {

  private UUID appointmentId;

  private String branchName;

  private AppointmentPatient patient;

  private AppointmentEmployee employee;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime appointmentDate;

  private Integer durationMinutes;

  private @Nullable String description;

  private @Nullable String notes;

  private AppointmentStatus status;

  public AppointmentResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public AppointmentResponse(UUID appointmentId, String branchName, AppointmentPatient patient, AppointmentEmployee employee, OffsetDateTime appointmentDate, Integer durationMinutes, AppointmentStatus status) {
    this.appointmentId = appointmentId;
    this.branchName = branchName;
    this.patient = patient;
    this.employee = employee;
    this.appointmentDate = appointmentDate;
    this.durationMinutes = durationMinutes;
    this.status = status;
  }

  public AppointmentResponse appointmentId(UUID appointmentId) {
    this.appointmentId = appointmentId;
    return this;
  }

  /**
   * Get appointmentId
   * @return appointmentId
   */
  @NotNull @Valid 
  @JsonProperty("appointmentId")
  public UUID getAppointmentId() {
    return appointmentId;
  }

  public void setAppointmentId(UUID appointmentId) {
    this.appointmentId = appointmentId;
  }

  public AppointmentResponse branchName(String branchName) {
    this.branchName = branchName;
    return this;
  }

  /**
   * Get branchName
   * @return branchName
   */
  @NotNull 
  @JsonProperty("branchName")
  public String getBranchName() {
    return branchName;
  }

  public void setBranchName(String branchName) {
    this.branchName = branchName;
  }

  public AppointmentResponse patient(AppointmentPatient patient) {
    this.patient = patient;
    return this;
  }

  /**
   * Get patient
   * @return patient
   */
  @NotNull @Valid 
  @JsonProperty("patient")
  public AppointmentPatient getPatient() {
    return patient;
  }

  public void setPatient(AppointmentPatient patient) {
    this.patient = patient;
  }

  public AppointmentResponse employee(AppointmentEmployee employee) {
    this.employee = employee;
    return this;
  }

  /**
   * Get employee
   * @return employee
   */
  @NotNull @Valid 
  @JsonProperty("employee")
  public AppointmentEmployee getEmployee() {
    return employee;
  }

  public void setEmployee(AppointmentEmployee employee) {
    this.employee = employee;
  }

  public AppointmentResponse appointmentDate(OffsetDateTime appointmentDate) {
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

  public AppointmentResponse durationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
    return this;
  }

  /**
   * Get durationMinutes
   * @return durationMinutes
   */
  @NotNull 
  @JsonProperty("durationMinutes")
  public Integer getDurationMinutes() {
    return durationMinutes;
  }

  public void setDurationMinutes(Integer durationMinutes) {
    this.durationMinutes = durationMinutes;
  }

  public AppointmentResponse description(@Nullable String description) {
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

  public AppointmentResponse notes(@Nullable String notes) {
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

  public AppointmentResponse status(AppointmentStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @NotNull @Valid 
  @JsonProperty("status")
  public AppointmentStatus getStatus() {
    return status;
  }

  public void setStatus(AppointmentStatus status) {
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
    AppointmentResponse appointmentResponse = (AppointmentResponse) o;
    return Objects.equals(this.appointmentId, appointmentResponse.appointmentId) &&
        Objects.equals(this.branchName, appointmentResponse.branchName) &&
        Objects.equals(this.patient, appointmentResponse.patient) &&
        Objects.equals(this.employee, appointmentResponse.employee) &&
        Objects.equals(this.appointmentDate, appointmentResponse.appointmentDate) &&
        Objects.equals(this.durationMinutes, appointmentResponse.durationMinutes) &&
        Objects.equals(this.description, appointmentResponse.description) &&
        Objects.equals(this.notes, appointmentResponse.notes) &&
        Objects.equals(this.status, appointmentResponse.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(appointmentId, branchName, patient, employee, appointmentDate, durationMinutes, description, notes, status);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AppointmentResponse {\n");
    sb.append("    appointmentId: ").append(toIndentedString(appointmentId)).append("\n");
    sb.append("    branchName: ").append(toIndentedString(branchName)).append("\n");
    sb.append("    patient: ").append(toIndentedString(patient)).append("\n");
    sb.append("    employee: ").append(toIndentedString(employee)).append("\n");
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

