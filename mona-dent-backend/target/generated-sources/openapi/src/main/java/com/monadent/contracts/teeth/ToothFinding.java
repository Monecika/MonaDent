package com.monadent.contracts.teeth;

import java.net.URI;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonValue;
import java.time.OffsetDateTime;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;


import java.util.*;
import jakarta.annotation.Generated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

/**
 * Gets or Sets ToothFinding
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", date = "2026-11-15T16:58:18.827271+01:00[Europe/Amsterdam]", comments = "Generator version: 7.14.0")
public enum ToothFinding {
  
  NOT_ASSESSED("NOT_ASSESSED"),
  
  HEALTHY("HEALTHY"),
  
  CARIES("CARIES"),
  
  PULPITIS("PULPITIS"),
  
  PERIODONTITIS("PERIODONTITIS"),
  
  PERIODONTAL_DISEASE("PERIODONTAL_DISEASE"),
  
  ROOT_PROBLEM("ROOT_PROBLEM"),
  
  FILLING("FILLING"),
  
  CROWN("CROWN"),
  
  IMPLANT("IMPLANT"),
  
  MISSING("MISSING");

  private final String value;

  ToothFinding(String value) {
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
  public static ToothFinding fromValue(String value) {
    for (ToothFinding b : ToothFinding.values()) {
      if (b.value.equals(value)) {
        return b;
      }
    }
    throw new IllegalArgumentException("Unexpected value '" + value + "'");
  }
}

