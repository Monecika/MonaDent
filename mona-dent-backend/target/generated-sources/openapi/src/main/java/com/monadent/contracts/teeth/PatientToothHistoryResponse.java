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
 * PatientToothHistoryResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.827271+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class PatientToothHistoryResponse {

  private UUID historyId;

  private UUID patientToothId;

  private Integer toothNumber;

  private ToothType toothType;

  private @Nullable Integer previousToothNumber;

  private @Nullable ToothType previousToothType;

  private String eventType;

  @Valid
  private List<ToothFinding> oldFindings = new ArrayList<>();

  @Valid
  private List<ToothFinding> newFindings = new ArrayList<>();

  private @Nullable Integer oldMobilityGrade;

  private @Nullable Integer newMobilityGrade;

  private String description;

  private @Nullable String notes;

  private UUID changedBy;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
  private OffsetDateTime changedAt;

  public PatientToothHistoryResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public PatientToothHistoryResponse(UUID historyId, UUID patientToothId, Integer toothNumber, ToothType toothType, String eventType, List<ToothFinding> oldFindings, List<ToothFinding> newFindings, String description, UUID changedBy, OffsetDateTime changedAt) {
    this.historyId = historyId;
    this.patientToothId = patientToothId;
    this.toothNumber = toothNumber;
    this.toothType = toothType;
    this.eventType = eventType;
    this.oldFindings = oldFindings;
    this.newFindings = newFindings;
    this.description = description;
    this.changedBy = changedBy;
    this.changedAt = changedAt;
  }

  public PatientToothHistoryResponse historyId(UUID historyId) {
    this.historyId = historyId;
    return this;
  }

  /**
   * Get historyId
   * @return historyId
   */
  @NotNull @Valid 
  @JsonProperty("historyId")
  public UUID getHistoryId() {
    return historyId;
  }

  public void setHistoryId(UUID historyId) {
    this.historyId = historyId;
  }

  public PatientToothHistoryResponse patientToothId(UUID patientToothId) {
    this.patientToothId = patientToothId;
    return this;
  }

  /**
   * Get patientToothId
   * @return patientToothId
   */
  @NotNull @Valid 
  @JsonProperty("patientToothId")
  public UUID getPatientToothId() {
    return patientToothId;
  }

  public void setPatientToothId(UUID patientToothId) {
    this.patientToothId = patientToothId;
  }

  public PatientToothHistoryResponse toothNumber(Integer toothNumber) {
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

  public PatientToothHistoryResponse toothType(ToothType toothType) {
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

  public PatientToothHistoryResponse previousToothNumber(@Nullable Integer previousToothNumber) {
    this.previousToothNumber = previousToothNumber;
    return this;
  }

  /**
   * Get previousToothNumber
   * @return previousToothNumber
   */
  
  @JsonProperty("previousToothNumber")
  public @Nullable Integer getPreviousToothNumber() {
    return previousToothNumber;
  }

  public void setPreviousToothNumber(@Nullable Integer previousToothNumber) {
    this.previousToothNumber = previousToothNumber;
  }

  public PatientToothHistoryResponse previousToothType(@Nullable ToothType previousToothType) {
    this.previousToothType = previousToothType;
    return this;
  }

  /**
   * Get previousToothType
   * @return previousToothType
   */
  @Valid 
  @JsonProperty("previousToothType")
  public @Nullable ToothType getPreviousToothType() {
    return previousToothType;
  }

  public void setPreviousToothType(@Nullable ToothType previousToothType) {
    this.previousToothType = previousToothType;
  }

  public PatientToothHistoryResponse eventType(String eventType) {
    this.eventType = eventType;
    return this;
  }

  /**
   * Get eventType
   * @return eventType
   */
  @NotNull 
  @JsonProperty("eventType")
  public String getEventType() {
    return eventType;
  }

  public void setEventType(String eventType) {
    this.eventType = eventType;
  }

  public PatientToothHistoryResponse oldFindings(List<ToothFinding> oldFindings) {
    this.oldFindings = oldFindings;
    return this;
  }

  public PatientToothHistoryResponse addOldFindingsItem(ToothFinding oldFindingsItem) {
    if (this.oldFindings == null) {
      this.oldFindings = new ArrayList<>();
    }
    this.oldFindings.add(oldFindingsItem);
    return this;
  }

  /**
   * Get oldFindings
   * @return oldFindings
   */
  @NotNull @Valid 
  @JsonProperty("oldFindings")
  public List<ToothFinding> getOldFindings() {
    return oldFindings;
  }

  public void setOldFindings(List<ToothFinding> oldFindings) {
    this.oldFindings = oldFindings;
  }

  public PatientToothHistoryResponse newFindings(List<ToothFinding> newFindings) {
    this.newFindings = newFindings;
    return this;
  }

  public PatientToothHistoryResponse addNewFindingsItem(ToothFinding newFindingsItem) {
    if (this.newFindings == null) {
      this.newFindings = new ArrayList<>();
    }
    this.newFindings.add(newFindingsItem);
    return this;
  }

  /**
   * Get newFindings
   * @return newFindings
   */
  @NotNull @Valid 
  @JsonProperty("newFindings")
  public List<ToothFinding> getNewFindings() {
    return newFindings;
  }

  public void setNewFindings(List<ToothFinding> newFindings) {
    this.newFindings = newFindings;
  }

  public PatientToothHistoryResponse oldMobilityGrade(@Nullable Integer oldMobilityGrade) {
    this.oldMobilityGrade = oldMobilityGrade;
    return this;
  }

  /**
   * Get oldMobilityGrade
   * minimum: 1
   * maximum: 3
   * @return oldMobilityGrade
   */
  @Min(1) @Max(3) 
  @JsonProperty("oldMobilityGrade")
  public @Nullable Integer getOldMobilityGrade() {
    return oldMobilityGrade;
  }

  public void setOldMobilityGrade(@Nullable Integer oldMobilityGrade) {
    this.oldMobilityGrade = oldMobilityGrade;
  }

  public PatientToothHistoryResponse newMobilityGrade(@Nullable Integer newMobilityGrade) {
    this.newMobilityGrade = newMobilityGrade;
    return this;
  }

  /**
   * Get newMobilityGrade
   * minimum: 1
   * maximum: 3
   * @return newMobilityGrade
   */
  @Min(1) @Max(3) 
  @JsonProperty("newMobilityGrade")
  public @Nullable Integer getNewMobilityGrade() {
    return newMobilityGrade;
  }

  public void setNewMobilityGrade(@Nullable Integer newMobilityGrade) {
    this.newMobilityGrade = newMobilityGrade;
  }

  public PatientToothHistoryResponse description(String description) {
    this.description = description;
    return this;
  }

  /**
   * Get description
   * @return description
   */
  @NotNull 
  @JsonProperty("description")
  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public PatientToothHistoryResponse notes(@Nullable String notes) {
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

  public PatientToothHistoryResponse changedBy(UUID changedBy) {
    this.changedBy = changedBy;
    return this;
  }

  /**
   * Get changedBy
   * @return changedBy
   */
  @NotNull @Valid 
  @JsonProperty("changedBy")
  public UUID getChangedBy() {
    return changedBy;
  }

  public void setChangedBy(UUID changedBy) {
    this.changedBy = changedBy;
  }

  public PatientToothHistoryResponse changedAt(OffsetDateTime changedAt) {
    this.changedAt = changedAt;
    return this;
  }

  /**
   * Get changedAt
   * @return changedAt
   */
  @NotNull @Valid 
  @JsonProperty("changedAt")
  public OffsetDateTime getChangedAt() {
    return changedAt;
  }

  public void setChangedAt(OffsetDateTime changedAt) {
    this.changedAt = changedAt;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    PatientToothHistoryResponse patientToothHistoryResponse = (PatientToothHistoryResponse) o;
    return Objects.equals(this.historyId, patientToothHistoryResponse.historyId) &&
        Objects.equals(this.patientToothId, patientToothHistoryResponse.patientToothId) &&
        Objects.equals(this.toothNumber, patientToothHistoryResponse.toothNumber) &&
        Objects.equals(this.toothType, patientToothHistoryResponse.toothType) &&
        Objects.equals(this.previousToothNumber, patientToothHistoryResponse.previousToothNumber) &&
        Objects.equals(this.previousToothType, patientToothHistoryResponse.previousToothType) &&
        Objects.equals(this.eventType, patientToothHistoryResponse.eventType) &&
        Objects.equals(this.oldFindings, patientToothHistoryResponse.oldFindings) &&
        Objects.equals(this.newFindings, patientToothHistoryResponse.newFindings) &&
        Objects.equals(this.oldMobilityGrade, patientToothHistoryResponse.oldMobilityGrade) &&
        Objects.equals(this.newMobilityGrade, patientToothHistoryResponse.newMobilityGrade) &&
        Objects.equals(this.description, patientToothHistoryResponse.description) &&
        Objects.equals(this.notes, patientToothHistoryResponse.notes) &&
        Objects.equals(this.changedBy, patientToothHistoryResponse.changedBy) &&
        Objects.equals(this.changedAt, patientToothHistoryResponse.changedAt);
  }

  @Override
  public int hashCode() {
    return Objects.hash(historyId, patientToothId, toothNumber, toothType, previousToothNumber, previousToothType, eventType, oldFindings, newFindings, oldMobilityGrade, newMobilityGrade, description, notes, changedBy, changedAt);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class PatientToothHistoryResponse {\n");
    sb.append("    historyId: ").append(toIndentedString(historyId)).append("\n");
    sb.append("    patientToothId: ").append(toIndentedString(patientToothId)).append("\n");
    sb.append("    toothNumber: ").append(toIndentedString(toothNumber)).append("\n");
    sb.append("    toothType: ").append(toIndentedString(toothType)).append("\n");
    sb.append("    previousToothNumber: ").append(toIndentedString(previousToothNumber)).append("\n");
    sb.append("    previousToothType: ").append(toIndentedString(previousToothType)).append("\n");
    sb.append("    eventType: ").append(toIndentedString(eventType)).append("\n");
    sb.append("    oldFindings: ").append(toIndentedString(oldFindings)).append("\n");
    sb.append("    newFindings: ").append(toIndentedString(newFindings)).append("\n");
    sb.append("    oldMobilityGrade: ").append(toIndentedString(oldMobilityGrade)).append("\n");
    sb.append("    newMobilityGrade: ").append(toIndentedString(newMobilityGrade)).append("\n");
    sb.append("    description: ").append(toIndentedString(description)).append("\n");
    sb.append("    notes: ").append(toIndentedString(notes)).append("\n");
    sb.append("    changedBy: ").append(toIndentedString(changedBy)).append("\n");
    sb.append("    changedAt: ").append(toIndentedString(changedAt)).append("\n");
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

