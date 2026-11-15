package com.monadent.contracts.ipaddresses;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonCreator;
import org.springframework.lang.Nullable;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

/**
 * CreateIpAddressRequest
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.879140+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public class CreateIpAddressRequest {

  private String name;

  private String address;

  public CreateIpAddressRequest() {
    super();
  }

  /**
   * Constructor with only required parameters
   */
  public CreateIpAddressRequest(String name, String address) {
    this.name = name;
    this.address = address;
  }

  public CreateIpAddressRequest name(String name) {
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

  public CreateIpAddressRequest address(String address) {
    this.address = address;
    return this;
  }

  /**
   * IPv4 address, CIDR network, or wildcard such as 217.103.33.*
   * @return address
   */
  @NotNull @Pattern(regexp = "^([0-9]{1,3}\\.){3}[0-9]{1,3}(/([0-9]|[12][0-9]|3[0-2]))?$|^([0-9]{1,3}\\.){3}\\*$") @Size(max = 18) 
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
    CreateIpAddressRequest createIpAddressRequest = (CreateIpAddressRequest) o;
    return Objects.equals(this.name, createIpAddressRequest.name) &&
        Objects.equals(this.address, createIpAddressRequest.address);
  }

  @Override
  public int hashCode() {
    return Objects.hash(name, address);
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("class CreateIpAddressRequest {\n");
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

