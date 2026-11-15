package com.monadent.domain.models.entity;

import com.monadent.domain.enums.ToothFinding;
import com.monadent.domain.enums.ToothType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import org.hibernate.annotations.ColumnDefault;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "patient_teeth")
@Data
@NoArgsConstructor
public class PatientTooth {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private UUID patientId;

    private int toothNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    private ToothType toothType;

    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "findings", columnDefinition = "jsonb", nullable = false)
    private List<ToothFinding> findings = new ArrayList<>(List.of(ToothFinding.NOT_ASSESSED));

    @Column(name = "mobility_grade")
    private Integer mobilityGrade;

    @Column(name = "is_current", nullable = false)
    @ColumnDefault("true")
    private boolean current = true;

    private String notes;

    private UUID updatedBy;

    @UpdateTimestamp
    private OffsetDateTime updatedAt;
}
