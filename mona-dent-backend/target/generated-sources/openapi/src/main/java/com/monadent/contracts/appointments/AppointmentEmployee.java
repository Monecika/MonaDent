package com.monadent.contracts.appointments;

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
 * AppointmentEmployee
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.689093+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class AppointmentEmployee {

  private UUID employeeId;

  private String role;

  private String name;

  private String surname;

  public AppointmentEmployee() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public AppointmentEmployee(UUID employeeId, String role, String name, String surname) {
    this.employeeId = employeeId;
    this.role = role;
    this.name = name;
    this.surname = surname;
  }

  public AppointmentEmployee employeeId(UUID employeeId) {
    this.employeeId = employeeId;
    return this;
  }

  /**
   * Get employeeId
   * @return employeeId
   */
  @NotNull @Valid 
  @JsonProperty("employeeId")
  public UUID getEmployeeId() {
    return employeeId;
  }

  public void setEmployeeId(UUID employeeId) {
    this.employeeId = employeeId;
  }

  public AppointmentEmployee role(String role) {
    this.role = role;
    return this;
  }

  /**
   * Get role
   * @return role
   */
  @NotNull 
  @JsonProperty("role")
  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }

  public AppointmentEmployee name(String name) {
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

  public AppointmentEmployee surname(String surname) {
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

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AppointmentEmployee appointmentEmployee = (AppointmentEmployee) o;
    return Objects.equals(this.employeeId, appointmentEmployee.employeeId) &&
        Objects.equals(this.role, appointmentEmployee.role) &&
        Objects.equals(this.name, appointmentEmployee.name) &&
        Objects.equals(this.surname, appointmentEmployee.surname);
  }

  @Override
  public int hashCode() {
    return Objects.hash(employeeId, role, name, surname);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AppointmentEmployee {\n");
    sb.append("    employeeId: ").append(toIndentedString(employeeId)).append("\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
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

