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
 * UserResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.547207+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class UserResponse {

  private UUID userId;

  @Valid
  private List<UUID> branchIds = new ArrayList<>();

  private String name;

  private String surname;

  private String email;

  private String phone;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private LocalDate dateOfBirth;

  private @Nullable String calendarColor;

  private Role role;

  private UserStatus status;

  /**
   * Gets or Sets preferredLanguage
   */
  public enum PreferredLanguageEnum {
    RO("ro"),
    
    RU("ru"),
    
    EN("en");

    private final String value;

    PreferredLanguageEnum(String value) {
      this.value = value;
    }

    @JsonValue
    public String getValue() {
      return value;
    }

    @Override
    public String toString() {
      return String.valueOf(value);
    }

    @JsonCreator
    public static PreferredLanguageEnum fromValue(String value) {
      for (PreferredLanguageEnum b : PreferredLanguageEnum.values()) {
        if (b.value.equals(value)) {
          return b;
        }
      }
      throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
  }

  private PreferredLanguageEnum preferredLanguage;

  public UserResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public UserResponse(UUID userId, List<UUID> branchIds, String name, String surname, String email, String phone, LocalDate dateOfBirth, Role role, UserStatus status, PreferredLanguageEnum preferredLanguage) {
    this.userId = userId;
    this.branchIds = branchIds;
    this.name = name;
    this.surname = surname;
    this.email = email;
    this.phone = phone;
    this.dateOfBirth = dateOfBirth;
    this.role = role;
    this.status = status;
    this.preferredLanguage = preferredLanguage;
  }

  public UserResponse userId(UUID userId) {
    this.userId = userId;
    return this;
  }

  /**
   * Get userId
   * @return userId
   */
  @NotNull @Valid 
  @JsonProperty("userId")
  public UUID getUserId() {
    return userId;
  }

  public void setUserId(UUID userId) {
    this.userId = userId;
  }

  public UserResponse branchIds(List<UUID> branchIds) {
    this.branchIds = branchIds;
    return this;
  }

  public UserResponse addBranchIdsItem(UUID branchIdsItem) {
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
  @NotNull @Valid 
  @JsonProperty("branchIds")
  public List<UUID> getBranchIds() {
    return branchIds;
  }

  public void setBranchIds(List<UUID> branchIds) {
    this.branchIds = branchIds;
  }

  public UserResponse name(String name) {
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

  public UserResponse surname(String surname) {
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

  public UserResponse email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
   */
  @NotNull @jakarta.validation.constraints.Email 
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public UserResponse phone(String phone) {
    this.phone = phone;
    return this;
  }

  /**
   * Get phone
   * @return phone
   */
  @NotNull 
  @JsonProperty("phone")
  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public UserResponse dateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
    return this;
  }

  /**
   * Get dateOfBirth
   * @return dateOfBirth
   */
  @NotNull @Valid 
  @JsonProperty("dateOfBirth")
  public LocalDate getDateOfBirth() {
    return dateOfBirth;
  }

  public void setDateOfBirth(LocalDate dateOfBirth) {
    this.dateOfBirth = dateOfBirth;
  }

  public UserResponse calendarColor(@Nullable String calendarColor) {
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

  public UserResponse role(Role role) {
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

  public UserResponse status(UserStatus status) {
    this.status = status;
    return this;
  }

  /**
   * Get status
   * @return status
   */
  @NotNull @Valid 
  @JsonProperty("status")
  public UserStatus getStatus() {
    return status;
  }

  public void setStatus(UserStatus status) {
    this.status = status;
  }

  public UserResponse preferredLanguage(PreferredLanguageEnum preferredLanguage) {
    this.preferredLanguage = preferredLanguage;
    return this;
  }

  /**
   * Get preferredLanguage
   * @return preferredLanguage
   */
  @NotNull 
  @JsonProperty("preferredLanguage")
  public PreferredLanguageEnum getPreferredLanguage() {
    return preferredLanguage;
  }

  public void setPreferredLanguage(PreferredLanguageEnum preferredLanguage) {
    this.preferredLanguage = preferredLanguage;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    UserResponse userResponse = (UserResponse) o;
    return Objects.equals(this.userId, userResponse.userId) &&
        Objects.equals(this.branchIds, userResponse.branchIds) &&
        Objects.equals(this.name, userResponse.name) &&
        Objects.equals(this.surname, userResponse.surname) &&
        Objects.equals(this.email, userResponse.email) &&
        Objects.equals(this.phone, userResponse.phone) &&
        Objects.equals(this.dateOfBirth, userResponse.dateOfBirth) &&
        Objects.equals(this.calendarColor, userResponse.calendarColor) &&
        Objects.equals(this.role, userResponse.role) &&
        Objects.equals(this.status, userResponse.status) &&
        Objects.equals(this.preferredLanguage, userResponse.preferredLanguage);
  }

  @Override
  public int hashCode() {
    return Objects.hash(userId, branchIds, name, surname, email, phone, dateOfBirth, calendarColor, role, status, preferredLanguage);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UserResponse {\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    branchIds: ").append(toIndentedString(branchIds)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    phone: ").append(toIndentedString(phone)).append("\n");
    sb.append("    dateOfBirth: ").append(toIndentedString(dateOfBirth)).append("\n");
    sb.append("    calendarColor: ").append(toIndentedString(calendarColor)).append("\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    status: ").append(toIndentedString(status)).append("\n");
    sb.append("    preferredLanguage: ").append(toIndentedString(preferredLanguage)).append("\n");
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

