package com.monadent.contracts.users;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import com.monadent.contracts.users.Role;
import com.monadent.contracts.users.UserStatus;
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
 * UpdateUserRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.547207+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class UpdateUserRequest {

  @Valid
  private List<UUID> branchIds = new ArrayList<>();

  private @Nullable String name;

  private @Nullable String surname;

  private @Nullable String email;

  private @Nullable String phone;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private @Nullable LocalDate dateOfBirth;

  private @Nullable String calendarColor;

  private @Nullable Role role;

  private @Nullable UserStatus status;

  public UpdateUserRequest branchIds(List<UUID> branchIds) {
    this.branchIds = branchIds;
    return this;
  }

  public UpdateUserRequest addBranchIdsItem(UUID branchIdsItem) {
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

  public UpdateUserRequest name(@Nullable String name) {
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

  public UpdateUserRequest surname(@Nullable String surname) {
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

  public UpdateUserRequest email(@Nullable String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
   */
  @Size(max = 255) @jakarta.validation.constraints.Email 
  @JsonProperty("email")
  public @Nullable String getEmail() {
    return email;
  }

  public void setEmail(@Nullable String email) {
    this.email = email;
  }

  public UpdateUserRequest phone(@Nullable String phone) {
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

  public UpdateUserRequest dateOfBirth(@Nullable LocalDate dateOfBirth) {
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

  public UpdateUserRequest calendarColor(@Nullable String calendarColor) {
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

  public UpdateUserRequest role(@Nullable Role role) {
    this.role = role;
    return this;
  }

  /**
   * Get role
   * @return role
   */
  @Valid 
  @JsonProperty("role")
  public @Nullable Role getRole() {
    return role;
  }

  public void setRole(@Nullable Role role) {
    this.role = role;
  }

  public UpdateUserRequest status(@Nullable UserStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @Valid 
  @JsonProperty("status")
  public @Nullable UserStatus getStatus() {
    return status;
  }

  public void setStatus(@Nullable UserStatus status) {
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
    UpdateUserRequest updateUserRequest = (UpdateUserRequest) o;
    return Objects.equals(this.branchIds, updateUserRequest.branchIds) &&
        Objects.equals(this.name, updateUserRequest.name) &&
        Objects.equals(this.surname, updateUserRequest.surname) &&
        Objects.equals(this.email, updateUserRequest.email) &&
        Objects.equals(this.phone, updateUserRequest.phone) &&
        Objects.equals(this.dateOfBirth, updateUserRequest.dateOfBirth) &&
        Objects.equals(this.calendarColor, updateUserRequest.calendarColor) &&
        Objects.equals(this.role, updateUserRequest.role) &&
        Objects.equals(this.status, updateUserRequest.status);
  }

  @Override
  public int hashCode() {
    return Objects.hash(branchIds, name, surname, email, phone, dateOfBirth, calendarColor, role, status);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UpdateUserRequest {\n");
    sb.append("    branchIds: ").append(toIndentedString(branchIds)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    phone: ").append(toIndentedString(phone)).append("\n");
    sb.append("    dateOfBirth: ").append(toIndentedString(dateOfBirth)).append("\n");
    sb.append("    calendarColor: ").append(toIndentedString(calendarColor)).append("\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
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

