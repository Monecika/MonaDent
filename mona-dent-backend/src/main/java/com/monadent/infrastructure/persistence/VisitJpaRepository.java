package com.monadent.infrastructure.persistence;

import com.monadent.domain.enums.VisitStatus;
import com.monadent.domain.models.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VisitJpaRepository extends JpaRepository<Visit, UUID> {
    boolean existsByBranchId(UUID branchId);

    List<Visit> findAllByPatientId(UUID patientId);

    Optional<Visit> findFirstByPatientIdOrderByVisitDateDesc(UUID patientId);

    boolean existsByAppointmentId(UUID appointmentId);

    List<Visit> findAllByStatus(VisitStatus status);
}
