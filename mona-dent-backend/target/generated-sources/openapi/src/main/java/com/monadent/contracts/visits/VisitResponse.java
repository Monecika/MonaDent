package com.monadent.contracts.visits;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.visits.VisitStatus;
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
 * VisitResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.788713+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class VisitResponse {

  private UUID visitId;

  private String branchName;

  private UUID patientId;

  private String doctorRole;

  private String doctorName;

  private String doctorSurname;

  private @Nullable UUID appointmentId = null;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime visitDate;

  private Integer durationMinutes;

  private @Nullable String description;

  private @Nullable String notes;

  private VisitStatus status;

  public VisitResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public VisitResponse(UUID visitId, String branchName, UUID patientId, String doctorRole, String doctorName, String doctorSurname, OffsetDateTime visitDate, Integer durationMinutes, VisitStatus status) {
    this.visitId = visitId;
    this.branchName = branchName;
    this.patientId = patientId;
    this.doctorRole = doctorRole;
    this.doctorName = doctorName;
    this.doctorSurname = doctorSurname;
    this.visitDate = visitDate;
    this.durationMinutes = durationMinutes;
    this.status = status;
  }

  public VisitResponse visitId(UUID visitId) {
    this.visitId = visitId;
    return this;
  }

  /**
   * Get visitId
   * @return visitId
   */
  @NotNull @Valid 
  @JsonProperty("visitId")
  public UUID getVisitId() {
    return visitId;
  }

  public void setVisitId(UUID visitId) {
    this.visitId = visitId;
  }

  public VisitResponse branchName(String branchName) {
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

  public VisitResponse patientId(UUID patientId) {
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

  public VisitResponse doctorRole(String doctorRole) {
    this.doctorRole = doctorRole;
    return this;
  }

  /**
   * Get doctorRole
   * @return doctorRole
   */
  @NotNull 
  @JsonProperty("doctorRole")
  public String getDoctorRole() {
    return doctorRole;
  }

  public void setDoctorRole(String doctorRole) {
    this.doctorRole = doctorRole;
  }

  public VisitResponse doctorName(String doctorName) {
    this.doctorName = doctorName;
    return this;
  }

  /**
   * Get doctorName
   * @return doctorName
   */
  @NotNull 
  @JsonProperty("doctorName")
  public String getDoctorName() {
    return doctorName;
  }

  public void setDoctorName(String doctorName) {
    this.doctorName = doctorName;
  }

  public VisitResponse doctorSurname(String doctorSurname) {
    this.doctorSurname = doctorSurname;
    return this;
  }

  /**
   * Get doctorSurname
   * @return doctorSurname
   */
  @NotNull 
  @JsonProperty("doctorSurname")
  public String getDoctorSurname() {
    return doctorSurname;
  }

  public void setDoctorSurname(String doctorSurname) {
    this.doctorSurname = doctorSurname;
  }

  public VisitResponse appointmentId(@Nullable UUID appointmentId) {
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

  public VisitResponse visitDate(OffsetDateTime visitDate) {
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

  public VisitResponse durationMinutes(Integer durationMinutes) {
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

  public VisitResponse description(@Nullable String description) {
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

  public VisitResponse notes(@Nullable String notes) {
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

  public VisitResponse status(VisitStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @NotNull @Valid 
  @JsonProperty("status")
  public VisitStatus getStatus() {
    return status;
  }

  public void setStatus(VisitStatus status) {
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
    VisitResponse visitResponse = (VisitResponse) o;
    return Objects.equals(this.visitId, visitResponse.visitId) &&
        Objects.equals(this.branchName, visitResponse.branchName) &&
        Objects.equals(this.patientId, visitResponse.patientId) &&
        Objects.equals(this.doctorRole, visitResponse.doctorRole) &&
        Objects.equals(this.doctorName, visitResponse.doctorName) &&
        Objects.equals(this.doctorSurname, visitResponse.doctorSurname) &&
        Objects.equals(this.appointmentId, visitResponse.appointmentId) &&
        Objects.equals(this.visitDate, visitResponse.visitDate) &&
        Objects.equals(this.durationMinutes, visitResponse.durationMinutes) &&
        Objects.equals(this.description, visitResponse.description) &&
        Objects.equals(this.notes, visitResponse.notes) &&
        Objects.equals(this.status, visitResponse.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(visitId, branchName, patientId, doctorRole, doctorName, doctorSurname, appointmentId, visitDate, durationMinutes, description, notes, status);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class VisitResponse {\n");
    sb.append("    visitId: ").append(toIndentedString(visitId)).append("\n");
    sb.append("    branchName: ").append(toIndentedString(branchName)).append("\n");
    sb.append("    patientId: ").append(toIndentedString(patientId)).append("\n");
    sb.append("    doctorRole: ").append(toIndentedString(doctorRole)).append("\n");
    sb.append("    doctorName: ").append(toIndentedString(doctorName)).append("\n");
    sb.append("    doctorSurname: ").append(toIndentedString(doctorSurname)).append("\n");
    sb.append("    appointmentId: ").append(toIndentedString(appointmentId)).append("\n");
    sb.append("    visitDate: ").append(toIndentedString(visitDate)).append("\n");
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

