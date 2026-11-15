package com.monadent.contracts.users;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.util.UUID;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * DoctorResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.547207+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class DoctorResponse {

  private UUID doctorId;

  private String name;

  private String surname;

  private @Nullable String calendarColor;

  public DoctorResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public DoctorResponse(UUID doctorId, String name, String surname) {
    this.doctorId = doctorId;
    this.name = name;
    this.surname = surname;
  }

  public DoctorResponse doctorId(UUID doctorId) {
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

  public DoctorResponse name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   */
  @NotNull 
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public DoctorResponse surname(String surname) {
    this.surname = surname;
    return this;
  }

  /**
   * Get surname
   * @return surname
   */
  @NotNull 
  @JsonProperty("surname")
  public String getSurname() {
    return surname;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public DoctorResponse calendarColor(@Nullable String calendarColor) {
    this.calendarColor = calendarColor;
    return this;
  }

  /**
   * Get calendarColor
   * @return calendarColor
   */
  
  @JsonProperty("calendarColor")
  public @Nullable String getCalendarColor() {
    return calendarColor;
  }

  public void setCalendarColor(@Nullable String calendarColor) {
    this.calendarColor = calendarColor;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    DoctorResponse doctorResponse = (DoctorResponse) o;
    return Objects.equals(this.doctorId, doctorResponse.doctorId) &&
        Objects.equals(this.name, doctorResponse.name) &&
        Objects.equals(this.surname, doctorResponse.surname) &&
        Objects.equals(this.calendarColor, doctorResponse.calendarColor);
  }

  @Override
  public int hashCode() {
    return Objects.hash(doctorId, name, surname, calendarColor);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class DoctorResponse {\n");
    sb.append("    doctorId: ").append(toIndentedString(doctorId)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
    sb.append("    calendarColor: ").append(toIndentedString(calendarColor)).append("\n");
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

