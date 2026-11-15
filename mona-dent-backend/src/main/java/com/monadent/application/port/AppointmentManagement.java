package com.monadent.application.port;

import com.monadent.contracts.appointments.AppointmentResponse;
import com.monadent.contracts.appointments.CreateAppointmentRequest;
import com.monadent.contracts.appointments.UpdateAppointmentRequest;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AppointmentManagement {
    List<AppointmentResponse> getAppointments(UUID branchId, LocalDate date);

    List<AppointmentResponse> getPatientAppointments(UUID patientId);

    Optional<AppointmentResponse> getNextPatientAppointment(UUID patientId);

    AppointmentResponse createAppointment(CreateAppointmentRequest request);

    AppointmentResponse updateAppointment(UUID appointmentId, UpdateAppointmentRequest request);

    void deleteAppointment(UUID appointmentId);
}
