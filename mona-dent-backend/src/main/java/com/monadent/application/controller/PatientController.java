package com.monadent.application.controller;

import com.monadent.application.port.PatientManagement;
import com.monadent.contracts.patients.CreatePatientRequest;
import com.monadent.contracts.patients.PatientResponse;
import com.monadent.contracts.patients.UpdatePatientRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patients")
public class PatientController {
    private final PatientManagement patientManagement;

    @GetMapping
    public ResponseEntity<List<PatientResponse>> getPatients() {
        return ResponseEntity.ok(patientManagement.getPatients());
    }

    @GetMapping("/{patientId}")
    public ResponseEntity<PatientResponse> getPatient(@PathVariable UUID patientId) {
        return ResponseEntity.ok(patientManagement.getPatient(patientId));
    }

    @PostMapping
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody CreatePatientRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(patientManagement.createPatient(request));
    }

    @PutMapping("/{patientId}")
    public ResponseEntity<PatientResponse> updatePatient(
            @PathVariable UUID patientId,
            @Valid @RequestBody UpdatePatientRequest request) {
        return ResponseEntity.ok(patientManagement.updatePatient(patientId, request));
    }
}
