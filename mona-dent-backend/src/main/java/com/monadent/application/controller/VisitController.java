package com.monadent.application.controller;

import com.monadent.application.port.VisitManagement;
import com.monadent.contracts.visits.CreateVisitRequest;
import com.monadent.contracts.visits.VisitResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/visits")
public class VisitController {
    private final VisitManagement visitManagement;

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<VisitResponse>> getPatientVisits(@PathVariable UUID patientId) {
        return ResponseEntity.ok(visitManagement.getPatientVisits(patientId));
    }

    @GetMapping("/patient/{patientId}/last")
    public ResponseEntity<VisitResponse> getLastPatientVisit(@PathVariable UUID patientId) {
        return visitManagement.getLastPatientVisit(patientId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    @PostMapping
    public ResponseEntity<VisitResponse> createVisit(@Valid @RequestBody CreateVisitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(visitManagement.createVisit(request));
    }
}
