package com.monadent.application.port;

import com.monadent.contracts.teeth.PatientToothResponse;
import com.monadent.contracts.teeth.PatientToothHistoryResponse;
import com.monadent.contracts.teeth.CreatePatientToothRequest;
import com.monadent.contracts.teeth.UpdatePatientToothRequest;

import java.util.List;
import java.util.UUID;

public interface PatientToothManagement {
    List<PatientToothResponse> getPatientTeeth(UUID patientId);

    List<PatientToothHistoryResponse> getPatientToothHistory(UUID patientId);

    PatientToothResponse addPatientTooth(UUID patientId, CreatePatientToothRequest request);

    PatientToothResponse updatePatientTooth(
            UUID patientId,
            UUID toothId,
            UpdatePatientToothRequest request);
}
