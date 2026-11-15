package com.monadent.contracts.users;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.users.Role;
import java.time.LocalDate;
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
 * CreateUserRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.547207+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class CreateUserRequest {

  @Valid
  private List<UUID> branchIds = new ArrayList<>();

  private String name;

  private String surname;

  private String email;

  private String phone;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private @Nullable LocalDate dateOfBirth;

  private @Nullable String calendarColor;

  private Role role;

  private String password;

  public CreateUserRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public CreateUserRequest(String name, String surname, String email, String phone, Role role, String password) {
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.role = role;
    this.password = password;
  }

  public CreateUserRequest branchIds(List<UUID> branchIds) {
    this.branchIds = branchIds;
    return this;
  }

  public CreateUserRequest addBranchIdsItem(UUID branchIdsItem) {
    if (this.branchIds == null) {
      this.branchIds = new ArrayList<>();
    }
    this.branchIds.add(branchIdsItem);
    return this;
  }

  /**
   * Get branchIds
   * @return branchIds
   */
  @Valid 
  @JsonProperty("branchIds")
  public List<UUID> getBranchIds() {
    return branchIds;
  }

  public void setBranchIds(List<UUID> branchIds) {
    this.branchIds = branchIds;
  }

  public CreateUserRequest name(String name) {
    this.name = name;
    return this;
  }

  /**
   * Get name
   * @return name
   */
  @NotNull @Size(min = 1, max = 100) 
  @JsonProperty("name")
  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public CreateUserRequest surname(String surname) {
    this.surname = surname;
    return this;
  }

  /**
   * Get surname
   * @return surname
   */
  @NotNull @Size(min = 1, max = 100) 
  @JsonProperty("surname")
  public String getSurname() {
    return surname;
  }

  public void setSurname(String surname) {
    this.surname = surname;
  }

  public CreateUserRequest email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
   */
  @NotNull @Size(max = 255) @jakarta.validation.constraints.Email 
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public CreateUserRequest phone(String phone) {
    this.phone = phone;
    return this;
  }

  /**
   * Get phone
   * @return phone
   */
  @NotNull @Size(min = 1, max = 30) 
  @JsonProperty("phone")
  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public CreateUserRequest dateOfBirth(@Nullable LocalDate dateOfBirth) {
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

  public CreateUserRequest calendarColor(@Nullable String calendarColor) {
    this.calendarColor = calendarColor;
    return this;
  }

  /**
   * Get calendarColor
   * @return calendarColor
   */
  @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") @Size(max = 7) 
  @JsonProperty("calendarColor")
  public @Nullable String getCalendarColor() {
    return calendarColor;
  }

  public void setCalendarColor(@Nullable String calendarColor) {
    this.calendarColor = calendarColor;
  }

  public CreateUserRequest role(Role role) {
    this.role = role;
    return this;
  }

  /**
   * Get role
   * @return role
   */
  @NotNull @Valid 
  @JsonProperty("role")
  public Role getRole() {
    return role;
  }

  public void setRole(Role role) {
    this.role = role;
  }

  public CreateUserRequest password(String password) {
    this.password = password;
    return this;
  }

  /**
   * Get password
   * @return password
   */
  @NotNull @Size(min = 8, max = 100) 
  @JsonProperty("password")
  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    CreateUserRequest createUserRequest = (CreateUserRequest) o;
    return Objects.equals(this.branchIds, createUserRequest.branchIds) &&
        Objects.equals(this.name, createUserRequest.name) &&
        Objects.equals(this.surname, createUserRequest.surname) &&
        Objects.equals(this.email, createUserRequest.email) &&
        Objects.equals(this.phone, createUserRequest.phone) &&
        Objects.equals(this.dateOfBirth, createUserRequest.dateOfBirth) &&
        Objects.equals(this.calendarColor, createUserRequest.calendarColor) &&
        Objects.equals(this.role, createUserRequest.role) &&
        Objects.equals(this.password, createUserRequest.password);
  }

  @Override
  public int hashCode() {
    return Objects.hash(branchIds, name, surname, email, phone, dateOfBirth, calendarColor, role, password);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class CreateUserRequest {\n");
    sb.append("    branchIds: ").append(toIndentedString(branchIds)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    phone: ").append(toIndentedString(phone)).append("\n");
    sb.append("    dateOfBirth: ").append(toIndentedString(dateOfBirth)).append("\n");
    sb.append("    calendarColor: ").append(toIndentedString(calendarColor)).append("\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    password: ").append(toIndentedString(password)).append("\n");
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

