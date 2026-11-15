package com.monadent.contracts.patients;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * UpdatePatientRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.751612+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class UpdatePatientRequest {

  private @Nullable String name;

  private @Nullable String surname;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private @Nullable LocalDate dateOfBirth;

  private @Nullable String phone;

  public UpdatePatientRequest name(@Nullable String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   */
  @Size(min = 1, max = 100) 
  @JsonProperty("name")
  public @Nullable String getName() {
    return name;
  }

  public void setName(@Nullable String name) {
    this.name = name;
  }

  public UpdatePatientRequest surname(@Nullable String surname) {
    this.surname = surname;
    return this;
  }

  /**
   * Get surname
   * @return surname
   */
  @Size(min = 1, max = 100) 
  @JsonProperty("surname")
  public @Nullable String getSurname() {
    return surname;
  }

  public void setSurname(@Nullable String surname) {
    this.surname = surname;
  }

  public UpdatePatientRequest dateOfBirth(@Nullable LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
    return this;
  }

  /**
   * Get dateOfBirth
   * @return dateOfBirth
   */
  @Valid 
  @JsonProperty("dateOfBirth")
  public @Nullable LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(@Nullable LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public UpdatePatientRequest phone(@Nullable String phone) {
    this.phone = phone;
    return this;
  }

  /**
   * Get phone
   * @return phone
   */
  @Size(min = 1, max = 30) 
  @JsonProperty("phone")
  public @Nullable String getPhone() {
    return phone;
  }

  public void setPhone(@Nullable String phone) {
    this.phone = phone;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UpdatePatientRequest updatePatientRequest = (UpdatePatientRequest) o;
    return Objects.equals(this.name, updatePatientRequest.name) &&
        Objects.equals(this.surname, updatePatientRequest.surname) &&
        Objects.equals(this.dateOfBirth, updatePatientRequest.dateOfBirth) &&
        Objects.equals(this.phone, updatePatientRequest.phone);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, surname, dateOfBirth, phone);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UpdatePatientRequest {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
    sb.append("    dateOfBirth: ").append(toIndentedString(dateOfBirth)).append("\n");
    sb.append("    phone: ").append(toIndentedString(phone)).append("\n");
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

