package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PatientJpaRepository extends JpaRepository<Patient, UUID> {
}
