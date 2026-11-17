package com.monadent.application.controller;

import com.monadent.application.events.PatientDataChangeNotifier;
import com.monadent.application.port.PatientToothManagement;
import com.monadent.contracts.teeth.CreatePatientToothRequest;
import com.monadent.contracts.teeth.PatientToothResponse;
import com.monadent.contracts.teeth.PatientToothHistoryResponse;
import com.monadent.contracts.teeth.UpdatePatientToothRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/patients/{patientId}/teeth")
public class PatientToothController {
    private final PatientToothManagement patientToothManagement;
    private final PatientDataChangeNotifier patientDataChangeNotifier;

    @GetMapping
    public ResponseEntity<List<PatientToothResponse>> getPatientTeeth(@PathVariable UUID patientId) {
        return ResponseEntity.ok(patientToothManagement.getPatientTeeth(patientId));
    }

    @GetMapping("/history")
    public ResponseEntity<List<PatientToothHistoryResponse>> getPatientToothHistory(
            @PathVariable UUID patientId) {
        return ResponseEntity.ok(patientToothManagement.getPatientToothHistory(patientId));
    }

    @PostMapping
    public ResponseEntity<PatientToothResponse> addPatientTooth(
            @PathVariable UUID patientId,
            @Valid @RequestBody CreatePatientToothRequest request) {
        PatientToothResponse tooth = patientToothManagement.addPatientTooth(patientId, request);
        patientDataChangeNotifier.patientDataChanged();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(tooth);
    }

    @PutMapping("/{toothId}")
    public ResponseEntity<PatientToothResponse> updatePatientTooth(
            @PathVariable UUID patientId,
            @PathVariable UUID toothId,
            @Valid @RequestBody UpdatePatientToothRequest request) {
        PatientToothResponse tooth = patientToothManagement.updatePatientTooth(patientId, toothId, request);
        patientDataChangeNotifier.patientDataChanged();
        return ResponseEntity.ok(tooth);
    }
}
