package com.monadent.contracts.branches;

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
 * BranchResponse
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.637964+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class BranchResponse {

  private UUID branchId;

  private String name;

  private String address;

  public BranchResponse() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public BranchResponse(UUID branchId, String name, String address) {
    this.branchId = branchId;
    this.name = name;
    this.address = address;
  }

  public BranchResponse branchId(UUID branchId) {
    this.branchId = branchId;
    return this;
  }

  /**
   * Get branchId
   * @return branchId
   */
  @NotNull @Valid 
  @JsonProperty("branchId")
  public UUID getBranchId() {
    return branchId;
  }

  public void setBranchId(UUID branchId) {
    this.branchId = branchId;
  }

  public BranchResponse name(String name) {
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

  public BranchResponse address(String address) {
    this.address = address;
    return this;
  }

  /**
   * Get address
   * @return address
   */
  @NotNull 
  @JsonProperty("address")
  public String getAddress() {
    return address;
  }

  public void setAddress(String address) {
    this.address = address;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) {
      return true;
    }
    if (o == null || getClass() != o.getClass()) {
      return false;
    }
    BranchResponse branchResponse = (BranchResponse) o;
    return Objects.equals(this.branchId, branchResponse.branchId) &&
        Objects.equals(this.name, branchResponse.name) &&
        Objects.equals(this.address, branchResponse.address);
  }

  @Override
  public int hashCode() {
    return Objects.hash(branchId, name, address);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class BranchResponse {\n");
    sb.append("    branchId: ").append(toIndentedString(branchId)).append("\n");
    sb.append("    name: ").append(toIndentedString(name)).append("\n");
    sb.append("    address: ").append(toIndentedString(address)).append("\n");
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

