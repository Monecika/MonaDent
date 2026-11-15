package com.monadent.domain.models.entity;

import com.monadent.domain.enums.VisitStatus;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "visits")
@Data
@NoArgsConstructor
public class Visit {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private UUID branchId;

    @NotNull
    private UUID patientId;

    @NotNull
    private UUID doctorId;

    private UUID appointmentId;

    @NotNull
    private OffsetDateTime visitDate;

    @NotNull
    private int durationMinutes = 5;
    private String description;
    private String notes;

    @NotNull
    @Enumerated(EnumType.STRING)
    private VisitStatus status = VisitStatus.IN_PROGRESS;

    @CreationTimestamp
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}