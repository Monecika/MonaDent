package com.monadent.contracts.teeth;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.teeth.ToothFinding;
import com.monadent.contracts.teeth.ToothType;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * PatientToothResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.827271+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class PatientToothResponse {

  private UUID toothId;

  private UUID patientId;

  private Integer toothNumber;

  private ToothType toothType;

  @Valid
  private List<ToothFinding> findings = new ArrayList<>();

  private @Nullable Integer mobilityGrade;

  private @Nullable String notes;

  private @Nullable UUID updatedBy;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private @Nullable OffsetDateTime updatedAt;

  public PatientToothResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public PatientToothResponse(UUID toothId, UUID patientId, Integer toothNumber, ToothType toothType, List<ToothFinding> findings) {
    this.toothId = toothId;
    this.patientId = patientId;
    this.toothNumber = toothNumber;
    this.toothType = toothType;
    this.findings = findings;
  }

  public PatientToothResponse toothId(UUID toothId) {
    this.toothId = toothId;
    return this;
  }

  /**
   * Get toothId
   * @return toothId
   */
  @NotNull @Valid 
  @JsonProperty("toothId")
  public UUID getToothId() {
    return toothId;
  }

  public void setToothId(UUID toothId) {
    this.toothId = toothId;
  }

  public PatientToothResponse patientId(UUID patientId) {
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

  public PatientToothResponse toothNumber(Integer toothNumber) {
    this.toothNumber = toothNumber;
    return this;
  }

  /**
   * Get toothNumber
   * @return toothNumber
   */
  @NotNull 
  @JsonProperty("toothNumber")
  public Integer getToothNumber() {
    return toothNumber;
  }

  public void setToothNumber(Integer toothNumber) {
    this.toothNumber = toothNumber;
  }

  public PatientToothResponse toothType(ToothType toothType) {
    this.toothType = toothType;
    return this;
  }

  /**
   * Get toothType
   * @return toothType
   */
  @NotNull @Valid 
  @JsonProperty("toothType")
  public ToothType getToothType() {
    return toothType;
  }

  public void setToothType(ToothType toothType) {
    this.toothType = toothType;
  }

  public PatientToothResponse findings(List<ToothFinding> findings) {
    this.findings = findings;
    return this;
  }

  public PatientToothResponse addFindingsItem(ToothFinding findingsItem) {
    if (this.findings == null) {
      this.findings = new ArrayList<>();
    }
    this.findings.add(findingsItem);
    return this;
  }

  /**
   * Get findings
   * @return findings
   */
  @NotNull @Valid 
  @JsonProperty("findings")
  public List<ToothFinding> getFindings() {
    return findings;
  }

  public void setFindings(List<ToothFinding> findings) {
    this.findings = findings;
  }

  public PatientToothResponse mobilityGrade(@Nullable Integer mobilityGrade) {
    this.mobilityGrade = mobilityGrade;
    return this;
  }

  /**
   * Get mobilityGrade
   * minimum: 1
   * maximum: 3
   * @return mobilityGrade
   */
  @Min(1) @Max(3) 
  @JsonProperty("mobilityGrade")
  public @Nullable Integer getMobilityGrade() {
    return mobilityGrade;
  }

  public void setMobilityGrade(@Nullable Integer mobilityGrade) {
    this.mobilityGrade = mobilityGrade;
  }

  public PatientToothResponse notes(@Nullable String notes) {
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

  public PatientToothResponse updatedBy(@Nullable UUID updatedBy) {
    this.updatedBy = updatedBy;
    return this;
  }

  /**
   * Get updatedBy
   * @return updatedBy
   */
  @Valid 
  @JsonProperty("updatedBy")
  public @Nullable UUID getUpdatedBy() {
    return updatedBy;
  }

  public void setUpdatedBy(@Nullable UUID updatedBy) {
    this.updatedBy = updatedBy;
  }

  public PatientToothResponse updatedAt(@Nullable OffsetDateTime updatedAt) {
    this.updatedAt = updatedAt;
    return this;
  }

  /**
   * Get updatedAt
   * @return updatedAt
   */
  @Valid 
  @JsonProperty("updatedAt")
  public @Nullable OffsetDateTime getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(@Nullable OffsetDateTime updatedAt) {
    this.updatedAt = updatedAt;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PatientToothResponse patientToothResponse = (PatientToothResponse) o;
    return Objects.equals(this.toothId, patientToothResponse.toothId) &&
        Objects.equals(this.patientId, patientToothResponse.patientId) &&
        Objects.equals(this.toothNumber, patientToothResponse.toothNumber) &&
        Objects.equals(this.toothType, patientToothResponse.toothType) &&
        Objects.equals(this.findings, patientToothResponse.findings) &&
        Objects.equals(this.mobilityGrade, patientToothResponse.mobilityGrade) &&
        Objects.equals(this.notes, patientToothResponse.notes) &&
        Objects.equals(this.updatedBy, patientToothResponse.updatedBy) &&
        Objects.equals(this.updatedAt, patientToothResponse.updatedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(toothId, patientId, toothNumber, toothType, findings, mobilityGrade, notes, updatedBy, updatedAt);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PatientToothResponse {\n");
    sb.append("    toothId: ").append(toIndentedString(toothId)).append("\n");
    sb.append("    patientId: ").append(toIndentedString(patientId)).append("\n");
    sb.append("    toothNumber: ").append(toIndentedString(toothNumber)).append("\n");
    sb.append("    toothType: ").append(toIndentedString(toothType)).append("\n");
    sb.append("    findings: ").append(toIndentedString(findings)).append("\n");
    sb.append("    mobilityGrade: ").append(toIndentedString(mobilityGrade)).append("\n");
    sb.append("    notes: ").append(toIndentedString(notes)).append("\n");
    sb.append("    updatedBy: ").append(toIndentedString(updatedBy)).append("\n");
    sb.append("    updatedAt: ").append(toIndentedString(updatedAt)).append("\n");
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

