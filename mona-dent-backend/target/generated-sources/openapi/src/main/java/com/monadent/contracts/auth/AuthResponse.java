package com.monadent.contracts.auth;

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
 * AuthResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.414739+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class AuthResponse {

  private String accessToken;

  private UUID userId;

  private String email;

  private String role;

  private Boolean mustChangePassword;

  public AuthResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public AuthResponse(String accessToken, UUID userId, String email, String role, Boolean mustChangePassword) {
    this.accessToken = accessToken;
    this.userId = userId;
    this.email = email;
    this.role = role;
    this.mustChangePassword = mustChangePassword;
  }

  public AuthResponse accessToken(String accessToken) {
    this.accessToken = accessToken;
    return this;
  }

  /**
   * Get accessToken
   * @return accessToken
   */
  @NotNull 
  @JsonProperty("accessToken")
  public String getAccessToken() {
    return accessToken;
  }

  public void setAccessToken(String accessToken) {
    this.accessToken = accessToken;
  }

  public AuthResponse userId(UUID userId) {
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

  public AuthResponse email(String email) {
    this.email = email;
    return this;
  }

  /**
   * Get email
   * @return email
   */
  @NotNull 
  @JsonProperty("email")
  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public AuthResponse role(String role) {
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

  public AuthResponse mustChangePassword(Boolean mustChangePassword) {
    this.mustChangePassword = mustChangePassword;
    return this;
  }

  /**
   * Get mustChangePassword
   * @return mustChangePassword
   */
  @NotNull 
  @JsonProperty("mustChangePassword")
  public Boolean getMustChangePassword() {
    return mustChangePassword;
  }

  public void setMustChangePassword(Boolean mustChangePassword) {
    this.mustChangePassword = mustChangePassword;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    AuthResponse authResponse = (AuthResponse) o;
    return Objects.equals(this.accessToken, authResponse.accessToken) &&
        Objects.equals(this.userId, authResponse.userId) &&
        Objects.equals(this.email, authResponse.email) &&
        Objects.equals(this.role, authResponse.role) &&
        Objects.equals(this.mustChangePassword, authResponse.mustChangePassword);
  }

  @Override
  public int hashCode() {
    return Objects.hash(accessToken, userId, email, role, mustChangePassword);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class AuthResponse {\n");
    sb.append("    accessToken: ").append(toIndentedString(accessToken)).append("\n");
    sb.append("    userId: ").append(toIndentedString(userId)).append("\n");
    sb.append("    email: ").append(toIndentedString(email)).append("\n");
    sb.append("    role: ").append(toIndentedString(role)).append("\n");
    sb.append("    mustChangePassword: ").append(toIndentedString(mustChangePassword)).append("\n");
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

