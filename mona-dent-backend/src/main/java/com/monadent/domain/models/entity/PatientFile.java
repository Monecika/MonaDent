package com.monadent.domain.models.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "patient_files")
@Data
@NoArgsConstructor
public class PatientFile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private UUID patientId;

    private UUID visitId;

    @NotNull
    private UUID uploadedBy;

    @NotNull
    @Size(max = 255)
    private String fileName;

    @NotNull
    @Size(max = 500)
    private String storageKey;

    @NotNull
    @Size(max = 150)
    private String contentType;

    @NotNull
    private Long fileSizeBytes;

    private String description;

    @CreationTimestamp
    private OffsetDateTime uploadedAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}
