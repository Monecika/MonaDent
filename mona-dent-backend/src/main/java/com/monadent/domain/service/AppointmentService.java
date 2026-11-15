package com.monadent.domain.service;

import com.monadent.application.port.AppointmentManagement;
import com.monadent.application.port.VisitManagement;
import com.monadent.contracts.appointments.AppointmentResponse;
import com.monadent.contracts.appointments.CreateAppointmentRequest;
import com.monadent.contracts.appointments.UpdateAppointmentRequest;
import com.monadent.contracts.visits.CreateVisitRequest;
import com.monadent.domain.enums.AppointmentStatus;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.Appointment;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.Patient;
import com.monadent.domain.models.entity.User;
import com.monadent.infrastructure.mapper.AppointmentMapper;
import com.monadent.infrastructure.persistence.AppointmentJpaRepository;
import com.monadent.infrastructure.persistence.BranchJpaRepository;
import com.monadent.infrastructure.persistence.BranchUserLookup;
import com.monadent.infrastructure.persistence.PatientJpaRepository;
import com.monadent.infrastructure.persistence.UserJpaRepository;
import com.monadent.infrastructure.persistence.VisitJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AppointmentService implements AppointmentManagement {
    private final AppointmentJpaRepository appointmentJpaRepository;
    private final PatientJpaRepository patientJpaRepository;
    private final UserJpaRepository userJpaRepository;
    private final BranchJpaRepository branchJpaRepository;
    private final BranchUserLookup branchUserLookup;
    private final AppointmentMapper appointmentMapper;
    private final VisitManagement visitManagement;
    private final VisitJpaRepository visitJpaRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getAppointments(UUID branchId, LocalDate date) {
        if (date == null) {
            return mapAppointmentResponses(appointmentJpaRepository.findByBranchIdAndStatusNot(branchId,
                                                                                               AppointmentStatus.CANCELLED));
        }

        ZoneId zone = ZoneId.systemDefault();
        OffsetDateTime start = date.atStartOfDay(zone)
                                   .toOffsetDateTime();
        OffsetDateTime end = date.plusDays(1)
                                 .atStartOfDay(zone)
                                 .toOffsetDateTime();
        return mapAppointmentResponses(appointmentJpaRepository.findByBranchAndDateAndStatusNot(branchId,
                                                                                    start,
                                                                                    end,
                                                                                    AppointmentStatus.CANCELLED));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> getPatientAppointments(UUID patientId) {
        if (!patientJpaRepository.existsById(patientId)) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.PATIENT_NOT_FOUND);
        }

        return mapAppointmentResponses(appointmentJpaRepository.findByPatient_Id(patientId));
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AppointmentResponse> getNextPatientAppointment(UUID patientId) {
        if (!patientJpaRepository.existsById(patientId)) {
            throw new BaseException(HttpStatus.NOT_FOUND.value(), ErrorCode.PATIENT_NOT_FOUND);
        }

        return appointmentJpaRepository.findNextForPatient(patientId,
                                                           OffsetDateTime.now(),
                                                           List.of(AppointmentStatus.CANCELLED,
                                                                   AppointmentStatus.NO_SHOW),
                                                           PageRequest.of(0, 1))
                                       .stream()
                                       .findFirst()
                                       .map(this::mapAppointmentResponse);
    }

    @Override
    public AppointmentResponse createAppointment(CreateAppointmentRequest request) {
        Appointment appointment = appointmentMapper.toAppointment(request);
        appointment.setPatient(findPatient(request.getPatientId()));
        appointment.setStatus(resolveAppointmentStatus(appointment.getAppointmentDate(), appointment.getDurationMinutes()));
        validateBranchAssignments(appointment);
        Appointment savedAppointment = appointmentJpaRepository.save(appointment);
        createVisitIfMissing(savedAppointment);
        return mapAppointmentResponse(savedAppointment);
    }

    @Override
    public AppointmentResponse updateAppointment(UUID appointmentId, UpdateAppointmentRequest request) {
        Appointment appointment = appointmentJpaRepository.findById(appointmentId)
                                                          .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                                               ErrorCode.APPOINTMENT_NOT_FOUND));
        appointmentMapper.updateAppointment(request, appointment);
        if (request.getPatientId() != null) {
            appointment.setPatient(findPatient(request.getPatientId()));
        }
        if (request.getStatus() == null) {
            appointment.setStatus(resolveAppointmentStatus(appointment.getAppointmentDate(), appointment.getDurationMinutes()));
        }
        validateBranchAssignments(appointment);
        Appointment savedAppointment = appointmentJpaRepository.save(appointment);
        createVisitIfMissing(savedAppointment);
        return mapAppointmentResponse(savedAppointment);
    }

    @Override
    public void deleteAppointment(UUID appointmentId) {
        Appointment appointment = appointmentJpaRepository.findById(appointmentId)
                                                          .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                                               ErrorCode.APPOINTMENT_NOT_FOUND));
        appointmentJpaRepository.delete(appointment);
    }

    @Scheduled(fixedRate = 60_000)
    public void updateAppointmentStatuses() {
        OffsetDateTime now = OffsetDateTime.now();
        List<Appointment> startedAppointments = appointmentJpaRepository.findDueByStatus(AppointmentStatus.SCHEDULED,
                                                                                         now);
        for (Appointment appointment : startedAppointments) {
            appointment.setStatus(isAppointmentOver(appointment, now) ?
                                          AppointmentStatus.COMPLETED :
                                          AppointmentStatus.IN_PROGRESS);
        }
        appointmentJpaRepository.saveAll(startedAppointments);

        List<Appointment> completedAppointments = appointmentJpaRepository.findDueByStatus(AppointmentStatus.IN_PROGRESS,
                                                                                           now)
                                                                          .stream()
                                                                          .filter(appointment -> isAppointmentOver(
                                                                                  appointment,
                                                                                  now))
                                                                          .toList();
        completedAppointments.forEach(appointment -> appointment.setStatus(AppointmentStatus.COMPLETED));
        appointmentJpaRepository.saveAll(completedAppointments);

        appointmentJpaRepository.findByStatusIn(List.of(AppointmentStatus.IN_PROGRESS, AppointmentStatus.COMPLETED))
                                .forEach(this::createVisitIfMissing);
    }

    private void createVisitIfMissing(Appointment appointment) {
        if ((appointment.getStatus() == AppointmentStatus.IN_PROGRESS
                || appointment.getStatus() == AppointmentStatus.COMPLETED)
                && !visitJpaRepository.existsByAppointmentId(appointment.getId())) {
            visitManagement.createVisit(new CreateVisitRequest(
                    appointment.getBranchId(),
                    appointment.getPatient().getId(),
                    appointment.getUserId(),
                    appointment.getAppointmentDate())
                    .appointmentId(appointment.getId())
                    .durationMinutes(appointment.getDurationMinutes())
                    .description(appointment.getDescription())
                    .notes(appointment.getNotes()));
        }
    }

    private boolean isAppointmentOver(Appointment appointment, OffsetDateTime now) {
        return !appointment.getAppointmentDate()
                           .plusMinutes(appointment.getDurationMinutes())
                           .isAfter(now);
    }

    private AppointmentStatus resolveAppointmentStatus(OffsetDateTime appointmentDate, int durationMinutes) {
        OffsetDateTime now = OffsetDateTime.now();
        OffsetDateTime end = appointmentDate.plusMinutes(durationMinutes);

        if (now.isBefore(appointmentDate)) {
            return AppointmentStatus.SCHEDULED;
        }
        if (!end.isAfter(now)) {
            return AppointmentStatus.COMPLETED;
        }
        return AppointmentStatus.IN_PROGRESS;
    }

    private List<AppointmentResponse> mapAppointmentResponses(List<Appointment> appointments) {
        var branchUsers = branchUserLookup.load(appointments, Appointment::getBranchId, Appointment::getUserId);
        return appointments.stream()
                           .map(appointment -> appointmentMapper.toResponse(appointment,
                                                                            branchUsers.branches()
                                                                                       .get(appointment.getBranchId()),
                                                                            branchUsers.users()
                                                                                       .get(appointment.getUserId())))
                           .toList();
    }

    private AppointmentResponse mapAppointmentResponse(Appointment appointment) {
        Branch branch = branchJpaRepository.findById(appointment.getBranchId())
                                           .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                                ErrorCode.BRANCH_NOT_FOUND));
        User employee = userJpaRepository.findById(appointment.getUserId())
                                         .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                              ErrorCode.ASSIGNED_USER_NOT_FOUND));
        return appointmentMapper.toResponse(appointment, branch, employee);
    }

    private void validateBranchAssignments(Appointment appointment) {
        if (!userJpaRepository.existsByIdAndBranches_Id(appointment.getUserId(), appointment.getBranchId())) {
            throw new BaseException(HttpStatus.BAD_REQUEST.value(),
                                    ErrorCode.ASSIGNED_USER_BRANCH_MISMATCH);
        }
    }

    private Patient findPatient(UUID patientId) {
        return patientJpaRepository.findById(patientId)
                                   .orElseThrow(() -> new BaseException(HttpStatus.NOT_FOUND.value(),
                                                                        ErrorCode.PATIENT_NOT_FOUND));
    }
}
