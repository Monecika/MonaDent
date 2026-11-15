package com.monadent.application.controller;

import com.monadent.application.port.AppointmentManagement;
import com.monadent.contracts.appointments.AppointmentResponse;
import com.monadent.contracts.appointments.CreateAppointmentRequest;
import com.monadent.contracts.appointments.UpdateAppointmentRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class AppointmentController {
    private final AppointmentManagement appointmentManagement;

    @GetMapping
    @PreAuthorize("@appointmentAuthorization.canAccessBranch(#p0)")
    public ResponseEntity<List<AppointmentResponse>> getAppointments(
            @RequestParam UUID branchId,
            @RequestParam(required = false) LocalDate date) {
        return ResponseEntity.ok(appointmentManagement.getAppointments(branchId, date));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<AppointmentResponse>> getPatientAppointments(@PathVariable UUID patientId) {
        return ResponseEntity.ok(appointmentManagement.getPatientAppointments(patientId));
    }

    @GetMapping("/patient/{patientId}/next")
    public ResponseEntity<AppointmentResponse> getNextPatientAppointment(@PathVariable UUID patientId) {
        return appointmentManagement.getNextPatientAppointment(patientId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    @PreAuthorize("@appointmentAuthorization.canAccessBranch(#p0.branchId)")
    public ResponseEntity<AppointmentResponse> createAppointment(
            @Valid @RequestBody CreateAppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(appointmentManagement.createAppointment(request));
    }

    @PutMapping("/{appointmentId}")
    @PreAuthorize("@appointmentAuthorization.canManageAppointment(#p0)")
    public ResponseEntity<AppointmentResponse> updateAppointment(
            @PathVariable UUID appointmentId,
            @Valid @RequestBody UpdateAppointmentRequest request) {
        return ResponseEntity.ok(appointmentManagement.updateAppointment(appointmentId, request));
    }

    @DeleteMapping("/{appointmentId}")
    @PreAuthorize("@appointmentAuthorization.canManageAppointment(#p0)")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID appointmentId) {
        appointmentManagement.deleteAppointment(appointmentId);
        return ResponseEntity.noContent().build();
    }
}
