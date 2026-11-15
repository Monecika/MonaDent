package com.monadent.contracts.users;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import java.time.LocalDate;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * UpdateMeRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.547207+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class UpdateMeRequest {

  private @Nullable String name;

  private @Nullable String surname;

  private @Nullable String email;

  private @Nullable String phone;

  @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
  private @Nullable LocalDate dateOfBirth;

  private @Nullable String calendarColor;

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

  private @Nullable PreferredLanguageEnum preferredLanguage;

  public UpdateMeRequest name(@Nullable String name) {
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

  public UpdateMeRequest surname(@Nullable String surname) {
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

  public UpdateMeRequest email(@Nullable String email) {
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

  public UpdateMeRequest phone(@Nullable String phone) {
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

  public UpdateMeRequest dateOfBirth(@Nullable LocalDate dateOfBirth) {
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

  public UpdateMeRequest calendarColor(@Nullable String calendarColor) {
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

  public UpdateMeRequest preferredLanguage(@Nullable PreferredLanguageEnum preferredLanguage) {
    this.preferredLanguage = preferredLanguage;
    return this;
  }

  /**
   * Get preferredLanguage
   * @return preferredLanguage
   */
  
  @JsonProperty("preferredLanguage")
  public @Nullable PreferredLanguageEnum getPreferredLanguage() {
    return preferredLanguage;
  }

  public void setPreferredLanguage(@Nullable PreferredLanguageEnum preferredLanguage) {
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
    UpdateMeRequest updateMeRequest = (UpdateMeRequest) o;
    return Objects.equals(this.name, updateMeRequest.name) &&
        Objects.equals(this.surname, updateMeRequest.surname) &&
        Objects.equals(this.email, updateMeRequest.email) &&
        Objects.equals(this.phone, updateMeRequest.phone) &&
        Objects.equals(this.dateOfBirth, updateMeRequest.dateOfBirth) &&
        Objects.equals(this.calendarColor, updateMeRequest.calendarColor) &&
        Objects.equals(this.preferredLanguage, updateMeRequest.preferredLanguage);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, surname, email, phone, dateOfBirth, calendarColor, preferredLanguage);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class UpdateMeRequest {\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    surname: ").append(toIndentedString(surname)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    phone: ").append(toIndentedString(phone)).append("\n");
    sb.append("    dateOfBirth: ").append(toIndentedString(dateOfBirth)).append("\n");
    sb.append("    calendarColor: ").append(toIndentedString(calendarColor)).append("\n");
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

