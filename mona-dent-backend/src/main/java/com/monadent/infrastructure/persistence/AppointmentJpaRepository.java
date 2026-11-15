package com.monadent.infrastructure.persistence;

import com.monadent.domain.models.entity.Appointment;
import com.monadent.domain.enums.AppointmentStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.OffsetDateTime;
import java.util.Collection;
import java.util.List;
import java.util.UUID;

public interface AppointmentJpaRepository extends JpaRepository<Appointment, UUID> {
    boolean existsByBranchId(UUID branchId);

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByBranchIdAndStatusNot(UUID branchId, AppointmentStatus status);

    @EntityGraph(attributePaths = "patient")
    @Query("""
        select a from Appointment a
        where a.branchId = :branchId
          and a.appointmentDate >= :start
          and a.appointmentDate < :end
          and a.status <> :status
        order by a.appointmentDate
        """)
    List<Appointment> findByBranchAndDateAndStatusNot(
            @Param("branchId") UUID branchId,
            @Param("start") OffsetDateTime start,
            @Param("end") OffsetDateTime end,
            @Param("status") AppointmentStatus status
    );

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByPatient_Id(UUID patientId);

    @EntityGraph(attributePaths = "patient")
    List<Appointment> findByStatusIn(Collection<AppointmentStatus> statuses);

    @EntityGraph(attributePaths = "patient")
    @Query("""
            select a from Appointment a
            where a.patient.id = :patientId
              and a.appointmentDate > :after
              and a.status not in :excludedStatuses
            order by a.appointmentDate
            """)
    List<Appointment> findNextForPatient(
            @Param("patientId") UUID patientId,
            @Param("after") OffsetDateTime after,
            @Param("excludedStatuses") Collection<AppointmentStatus> excludedStatuses,
            Pageable pageable);

    @Query("""
            select a from Appointment a
            where a.status = :status
              and a.appointmentDate <= :date
            """)
    List<Appointment> findDueByStatus(
            @Param("status") AppointmentStatus status,
            @Param("date") OffsetDateTime date);

}
