package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.PatientTooth;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PatientToothJpaRepository extends JpaRepository<PatientTooth, UUID> {
    List<PatientTooth> findAllByPatientIdOrderByToothNumber(UUID patientId);

    List<PatientTooth> findAllByPatientIdAndCurrentTrueOrderByToothNumber(UUID patientId);

    Optional<PatientTooth> findByIdAndPatientIdAndCurrentTrue(UUID id, UUID patientId);
}
