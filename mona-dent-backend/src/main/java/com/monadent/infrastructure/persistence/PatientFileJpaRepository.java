package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.PatientFile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PatientFileJpaRepository extends JpaRepository<PatientFile, UUID> {
    List<PatientFile> findAllByPatientIdOrderByUploadedAtDesc(UUID patientId);
    Optional<PatientFile> findByIdAndPatientId(UUID id, UUID patientId);
}
