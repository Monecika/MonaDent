package com.monadent.infrastructure.mapper;

import com.monadent.contracts.patients.CreatePatientRequest;
import com.monadent.contracts.patients.PatientResponse;
import com.monadent.contracts.patients.UpdatePatientRequest;
import com.monadent.domain.models.entity.Patient;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PatientMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Patient toPatient(CreatePatientRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientNumber", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updatePatient(UpdatePatientRequest request, @MappingTarget Patient patient);

    @Mapping(target = "patientId", source = "id")
    PatientResponse toResponse(Patient patient);
}
