package com.monadent.application.port;

import com.monadent.contracts.patients.CreatePatientRequest;
import com.monadent.contracts.patients.PatientResponse;
import com.monadent.contracts.patients.UpdatePatientRequest;

import java.util.List;
import java.util.UUID;

public interface PatientManagement {
    List<PatientResponse> getPatients();

    PatientResponse getPatient(UUID patientId);

    PatientResponse createPatient(CreatePatientRequest request);

    PatientResponse updatePatient(UUID patientId, UpdatePatientRequest request);
}
