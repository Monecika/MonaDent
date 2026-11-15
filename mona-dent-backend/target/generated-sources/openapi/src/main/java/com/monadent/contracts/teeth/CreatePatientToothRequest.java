package com.monadent.contracts.teeth;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.teeth.ToothFinding;
import com.monadent.contracts.teeth.ToothType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * CreatePatientToothRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.827271+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class CreatePatientToothRequest {

  private Integer toothNumber;

  private ToothType toothType;

  @Valid
  private List<ToothFinding> findings = new ArrayList<>();

  private @Nullable Integer mobilityGrade;

  private @Nullable String notes;

  public CreatePatientToothRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public CreatePatientToothRequest(Integer toothNumber, ToothType toothType) {
    this.toothNumber = toothNumber;
    this.toothType = toothType;
  }

  public CreatePatientToothRequest toothNumber(Integer toothNumber) {
    this.toothNumber = toothNumber;
    return this;
  }

  /**
   * FDI tooth number; the number must match the specified toothType.
   * minimum: 11
   * maximum: 85
   * @return toothNumber
   */
  @NotNull @Min(11) @Max(85) 
  @JsonProperty("toothNumber")
  public Integer getToothNumber() {
    return toothNumber;
  }

  public void setToothNumber(Integer toothNumber) {
    this.toothNumber = toothNumber;
  }

  public CreatePatientToothRequest toothType(ToothType toothType) {
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

  public CreatePatientToothRequest findings(List<ToothFinding> findings) {
    this.findings = findings;
    return this;
  }

  public CreatePatientToothRequest addFindingsItem(ToothFinding findingsItem) {
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
  @Valid 
  @JsonProperty("findings")
  public List<ToothFinding> getFindings() {
    return findings;
  }

  public void setFindings(List<ToothFinding> findings) {
    this.findings = findings;
  }

  public CreatePatientToothRequest mobilityGrade(@Nullable Integer mobilityGrade) {
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

  public CreatePatientToothRequest notes(@Nullable String notes) {
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
    CreatePatientToothRequest createPatientToothRequest = (CreatePatientToothRequest) o;
    return Objects.equals(this.toothNumber, createPatientToothRequest.toothNumber) &&
        Objects.equals(this.toothType, createPatientToothRequest.toothType) &&
        Objects.equals(this.findings, createPatientToothRequest.findings) &&
        Objects.equals(this.mobilityGrade, createPatientToothRequest.mobilityGrade) &&
        Objects.equals(this.notes, createPatientToothRequest.notes);
  }

  @Override
  public int hashCode() {
    return Objects.hash(toothNumber, toothType, findings, mobilityGrade, notes);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class CreatePatientToothRequest {\n");
    sb.append("    toothNumber: ").append(toIndentedString(toothNumber)).append("\n");
    sb.append("    toothType: ").append(toIndentedString(toothType)).append("\n");
    sb.append("    findings: ").append(toIndentedString(findings)).append("\n");
    sb.append("    mobilityGrade: ").append(toIndentedString(mobilityGrade)).append("\n");
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

