package com.monadent.infrastructure.mapper;

import com.monadent.contracts.teeth.PatientToothResponse;
import com.monadent.contracts.teeth.CreatePatientToothRequest;
import com.monadent.contracts.teeth.UpdatePatientToothRequest;
import com.monadent.domain.models.entity.PatientTooth;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface PatientToothMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientId", ignore = true)
    @Mapping(target = "current", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PatientTooth toPatientTooth(CreatePatientToothRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "patientId", ignore = true)
    @Mapping(target = "toothNumber", ignore = true)
    @Mapping(target = "toothType", ignore = true)
    @Mapping(target = "current", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updatePatientTooth(UpdatePatientToothRequest request, @MappingTarget PatientTooth patientTooth);

    @Mapping(target = "toothId", source = "id")
    PatientToothResponse toResponse(PatientTooth patientTooth);
}
