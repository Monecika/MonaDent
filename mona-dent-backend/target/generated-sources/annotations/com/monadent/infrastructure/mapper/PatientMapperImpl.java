package com.monadent.infrastructure.mapper;

import com.monadent.contracts.patients.CreatePatientRequest;
import com.monadent.contracts.patients.PatientResponse;
import com.monadent.contracts.patients.UpdatePatientRequest;
import com.monadent.domain.models.entity.Patient;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-15T16:58:19+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class PatientMapperImpl implements PatientMapper {

    @Override
    public Patient toPatient(CreatePatientRequest request) {
        if ( request == null ) {
            return null;
        }

        Patient patient = new Patient();

        patient.setName( request.getName() );
        patient.setSurname( request.getSurname() );
        patient.setDateOfBirth( request.getDateOfBirth() );
        patient.setPhone( request.getPhone() );

        return patient;
    }

    @Override
    public void updatePatient(UpdatePatientRequest request, Patient patient) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            patient.setName( request.getName() );
        }
        if ( request.getSurname() != null ) {
            patient.setSurname( request.getSurname() );
        }
        if ( request.getDateOfBirth() != null ) {
            patient.setDateOfBirth( request.getDateOfBirth() );
        }
        if ( request.getPhone() != null ) {
            patient.setPhone( request.getPhone() );
        }
    }

    @Override
    public PatientResponse toResponse(Patient patient) {
        if ( patient == null ) {
            return null;
        }

        PatientResponse patientResponse = new PatientResponse();

        patientResponse.setPatientId( patient.getId() );
        patientResponse.setName( patient.getName() );
        patientResponse.setSurname( patient.getSurname() );
        patientResponse.setDateOfBirth( patient.getDateOfBirth() );
        patientResponse.setPhone( patient.getPhone() );
        patientResponse.setCreatedAt( patient.getCreatedAt() );

        return patientResponse;
    }
}
