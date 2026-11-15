package com.monadent.domain.service;

import com.monadent.application.port.VisitManagement;
import com.monadent.contracts.visits.CreateVisitRequest;
import com.monadent.contracts.visits.VisitResponse;
import com.monadent.domain.enums.VisitStatus;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.Visit;
import com.monadent.infrastructure.mapper.VisitMapper;
import com.monadent.infrastructure.persistence.AppointmentJpaRepository;
import com.monadent.infrastructure.persistence.BranchJpaRepository;
import com.monadent.infrastructure.persistence.BranchUserLookup;
import com.monadent.infrastructure.persistence.PatientJpaRepository;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import com.monadent.infrastructure.persistence.VisitJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class VisitService implements VisitManagement {
    private final VisitJpaRepository visitJpaRepository;
    private final PatientJpaRepository patientJpaRepository;
    private final BranchJpaRepository branchJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final AppointmentJpaRepository appointmentJpaRepository;
    private final BranchUserLookup branchUserLookup;
    private final VisitMapper visitMapper;

    @Override
    @Transactional(readOnly = true)
    public List<VisitResponse> getPatientVisits(UUID patientId) {
        if (!patientJpaRepository.existsById(patientId)) {
            throw patientNotFound();
        }
        return mapVisitResponses(visitJpaRepository.findAllByPatientId(patientId));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<VisitResponse> getLastPatientVisit(UUID patientId) {
        if (!patientJpaRepository.existsById(patientId)) {
            throw patientNotFound();
        }
        return visitJpaRepository.findFirstByPatientIdOrderByVisitDateDesc(patientId)
                .map(this::mapVisitResponse);
    }

    @Override
    public VisitResponse createVisit(CreateVisitRequest request) {
        validateReferences(request);
        Visit visit = visitMapper.toVisit(request);
        visit.setStatus(resolveVisitStatus(visit.getVisitDate(), visit.getDurationMinutes()));
        Visit savedVisit = visitJpaRepository.save(visit);
        return mapVisitResponse(savedVisit);
    }

    @Scheduled(fixedRate = 60_000)
    public void updateVisitStatuses() {
        OffsetDateTime now = OffsetDateTime.now();
        List<Visit> inProgressVisits = visitJpaRepository.findAllByStatus(VisitStatus.IN_PROGRESS);

        List<Visit> completedVisits = inProgressVisits.stream()
                .filter(visit -> !visit.getVisitDate()
                        .plusMinutes(visit.getDurationMinutes())
                        .isAfter(now))
                .toList();

        completedVisits.forEach(visit -> visit.setStatus(VisitStatus.COMPLETED));
        visitJpaRepository.saveAll(completedVisits);
    }

    private VisitStatus resolveVisitStatus(OffsetDateTime visitDate, int durationMinutes) {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime end = visitDate.plusMinutes(durationMinutes);

        if (now.isBefore(visitDate)) {
            return VisitStatus.IN_PROGRESS;
        }
        if (!end.isAfter(now)) {
            return VisitStatus.COMPLETED;
        }
        return VisitStatus.IN_PROGRESS;
    }

    private List<VisitResponse> mapVisitResponses(List<Visit> visits) {
        var branchUsers = branchUserLookup.load(visits, Visit::getBranchId, Visit::getDoctorId);
        return visits.stream()
                .map(visit -> visitMapper.toResponse(
                        visit,
                        branchUsers.branches().get(visit.getBranchId()),
                        branchUsers.users().get(visit.getDoctorId())))
                .toList();
    }

    private VisitResponse mapVisitResponse(Visit visit) {
        var branch = branchJpaRepository.findById(visit.getBranchId())
                .orElseThrow(() -> new BaseException(
                        HttpStatus.NOT_FOUND.value(),
                        ErrorCode.BRANCH_NOT_FOUND));
        var doctor = userJpaRepository.findById(visit.getDoctorId())
                .orElseThrow(() -> new BaseException(
                        HttpStatus.NOT_FOUND.value(),
                        ErrorCode.DOCTOR_NOT_FOUND));
        return visitMapper.toResponse(visit, branch, doctor);
    }

    private void validateReferences(CreateVisitRequest request) {
        if (!branchJpaRepository.existsById(request.getBranchId())) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.BRANCH_NOT_FOUND);
        }
        if (!patientJpaRepository.existsById(request.getPatientId())) {
            throw patientNotFound();
        }
        if (!userJpaRepository.existsById(request.getDoctorId())) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.DOCTOR_NOT_FOUND);
        }
        if (request.getAppointmentId() != null
                && !appointmentJpaRepository.existsById(request.getAppointmentId())) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.APPOINTMENT_NOT_FOUND);
        }
    }

    private BaseException patientNotFound() {
        return new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.PATIENT_NOT_FOUND);
    }

}
