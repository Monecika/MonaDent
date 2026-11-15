package com.monadent.application.port;

import com.monadent.contracts.visits.CreateVisitRequest;
import com.monadent.contracts.visits.VisitResponse;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VisitManagement {
    List<VisitResponse> getPatientVisits(UUID patientId);

    Optional<VisitResponse> getLastPatientVisit(UUID patientId);

    VisitResponse createVisit(CreateVisitRequest request);
}
