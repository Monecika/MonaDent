package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.ToothHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface ToothHistoryJpaRepository extends JpaRepository<ToothHistory, UUID> {
    List<ToothHistory> findAllByPatientToothIdInOrderByChangedAtDesc(Collection<UUID> patientToothIds);
}
