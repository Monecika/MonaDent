package com.monadent.domain.models.entity;

import com.monadent.domain.enums.ToothFinding;
import com.monadent.domain.enums.ToothType;
import jakarta.persistence.Entity;
import jakarta.persistence.Column;
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
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "tooth_history")
@Data
@NoArgsConstructor
public class ToothHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotNull
    private UUID patientToothId;

    private UUID visitId;

    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "old_findings", columnDefinition = "jsonb", nullable = false)
    private List<ToothFinding> oldFindings;

    @NotNull
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "new_findings", columnDefinition = "jsonb", nullable = false)
    private List<ToothFinding> newFindings;

    @Column(name = "old_mobility_grade")
    private Integer oldMobilityGrade;

    @Column(name = "new_mobility_grade")
    private Integer newMobilityGrade;

    private String eventType;

    @Enumerated(EnumType.STRING)
    private ToothType oldToothType;

    @Enumerated(EnumType.STRING)
    private ToothType newToothType;

    private Integer oldToothNumber;

    private Integer newToothNumber;

    @NotNull
    private String description;

    private String notes;

    @NotNull
    private UUID changedBy;

    @CreationTimestamp
    private OffsetDateTime changedAt;
}
