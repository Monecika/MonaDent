package com.monadent.infrastructure.mapper;

import com.monadent.contracts.appointments.AppointmentResponse;
import com.monadent.contracts.appointments.AppointmentEmployee;
import com.monadent.contracts.appointments.AppointmentPatient;
import com.monadent.contracts.appointments.CreateAppointmentRequest;
import com.monadent.contracts.appointments.UpdateAppointmentRequest;
import com.monadent.domain.models.entity.Appointment;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.Patient;
import com.monadent.domain.models.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface AppointmentMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Appointment toAppointment(CreateAppointmentRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branchId", ignore = true)
    @Mapping(target = "patient", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateAppointment(UpdateAppointmentRequest request, @MappingTarget Appointment appointment);

    @Mapping(target = "appointmentId", source = "appointment.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "employee", source = "employee")
    @Mapping(target = "patient", source = "appointment.patient")
    @Mapping(target = "status", source = "appointment.status")
    AppointmentResponse toResponse(Appointment appointment, Branch branch, User employee);

    @Mapping(target = "employeeId", source = "id")
    @Mapping(target = "role", constant = "Dr.")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "surname", source = "surname")
    AppointmentEmployee toAppointmentEmployee(User employee);

    @Mapping(target = "patientId", source = "id")
    AppointmentPatient toAppointmentPatient(Patient patient);
}
