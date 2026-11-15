package com.monadent.domain.service;

import com.monadent.application.port.PatientManagement;
import com.monadent.contracts.patients.CreatePatientRequest;
import com.monadent.contracts.patients.PatientResponse;
import com.monadent.contracts.patients.UpdatePatientRequest;
import com.monadent.domain.exception.BaseException;
import com.monadent.domain.exception.ErrorCode;
import com.monadent.domain.models.entity.Patient;
import com.monadent.infrastructure.mapper.PatientMapper;
import com.monadent.infrastructure.persistence.PatientJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientService implements PatientManagement {
    private final PatientJpaRepository patientJpaRepository;
    private final PatientMapper patientMapper;

    @Override
    @Transactional(readOnly = true)
    public List<PatientResponse> getPatients() {
        return patientJpaRepository.findAll().stream()
                .map(patientMapper::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatient(UUID patientId) {
        return patientJpaRepository.findById(patientId)
                .map(patientMapper::toResponse)
                .orElseThrow(this::patientNotFound);
    }

    @Override
    public PatientResponse createPatient(CreatePatientRequest request) {
        LocalDate today = LocalDate.now();
        if (request.getDateOfBirth().isAfter(today)) {
            throw new BaseException(
                    HttpStatus.BAD_REQUEST.value(),
                    ErrorCode.DATE_OF_BIRTH_IN_FUTURE);
        }

        Patient patient = patientMapper.toPatient(request);
        return patientMapper.toResponse(patientJpaRepository.save(patient));
    }

    @Override
    public PatientResponse updatePatient(UUID patientId, UpdatePatientRequest request) {
        Patient patient = patientJpaRepository.findById(patientId)
                .orElseThrow(this::patientNotFound);
        if (request.getDateOfBirth() != null && request.getDateOfBirth().isAfter(LocalDate.now())) {
            throw new BaseException(
                    HttpStatus.BAD_REQUEST.value(),
                    ErrorCode.DATE_OF_BIRTH_IN_FUTURE);
        }
        patientMapper.updatePatient(request, patient);
        return patientMapper.toResponse(patientJpaRepository.save(patient));
    }

    private BaseException patientNotFound() {
        return new BaseException(
                HttpStatus.NOT_FOUND.value(),
                ErrorCode.PATIENT_NOT_FOUND);
    }
}
