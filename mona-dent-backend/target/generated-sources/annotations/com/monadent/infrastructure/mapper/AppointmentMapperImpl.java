package com.monadent.infrastructure.mapper;

import com.monadent.contracts.appointments.AppointmentEmployee;
import com.monadent.contracts.appointments.AppointmentPatient;
import com.monadent.contracts.appointments.AppointmentResponse;
import com.monadent.contracts.appointments.AppointmentStatus;
import com.monadent.contracts.appointments.CreateAppointmentRequest;
import com.monadent.contracts.appointments.UpdateAppointmentRequest;
import com.monadent.domain.models.entity.Appointment;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.Patient;
import com.monadent.domain.models.entity.User;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-15T16:58:19+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class AppointmentMapperImpl implements AppointmentMapper {

    @Override
    public Appointment toAppointment(CreateAppointmentRequest request) {
        if ( request == null ) {
            return null;
        }

        Appointment appointment = new Appointment();

        appointment.setBranchId( request.getBranchId() );
        appointment.setUserId( request.getUserId() );
        appointment.setAppointmentDate( request.getAppointmentDate() );
        if ( request.getDurationMinutes() != null ) {
            appointment.setDurationMinutes( request.getDurationMinutes() );
        }
        appointment.setDescription( request.getDescription() );
        appointment.setNotes( request.getNotes() );

        return appointment;
    }

    @Override
    public void updateAppointment(UpdateAppointmentRequest request, Appointment appointment) {
        if ( request == null ) {
            return;
        }

        if ( request.getUserId() != null ) {
            appointment.setUserId( request.getUserId() );
        }
        if ( request.getAppointmentDate() != null ) {
            appointment.setAppointmentDate( request.getAppointmentDate() );
        }
        if ( request.getDurationMinutes() != null ) {
            appointment.setDurationMinutes( request.getDurationMinutes() );
        }
        if ( request.getDescription() != null ) {
            appointment.setDescription( request.getDescription() );
        }
        if ( request.getNotes() != null ) {
            appointment.setNotes( request.getNotes() );
        }
        if ( request.getStatus() != null ) {
            appointment.setStatus( appointmentStatusToAppointmentStatus( request.getStatus() ) );
        }
    }

    @Override
    public AppointmentResponse toResponse(Appointment appointment, Branch branch, User employee) {
        if ( appointment == null && branch == null && employee == null ) {
            return null;
        }

        AppointmentResponse appointmentResponse = new AppointmentResponse();

        if ( appointment != null ) {
            appointmentResponse.setAppointmentId( appointment.getId() );
            appointmentResponse.setPatient( toAppointmentPatient( appointment.getPatient() ) );
            appointmentResponse.setStatus( appointmentStatusToAppointmentStatus1( appointment.getStatus() ) );
            appointmentResponse.setAppointmentDate( appointment.getAppointmentDate() );
            appointmentResponse.setDurationMinutes( appointment.getDurationMinutes() );
            appointmentResponse.setDescription( appointment.getDescription() );
            appointmentResponse.setNotes( appointment.getNotes() );
        }
        if ( branch != null ) {
            appointmentResponse.setBranchName( branch.getName() );
        }
        appointmentResponse.setEmployee( toAppointmentEmployee( employee ) );

        return appointmentResponse;
    }

    @Override
    public AppointmentEmployee toAppointmentEmployee(User employee) {
        if ( employee == null ) {
            return null;
        }

        AppointmentEmployee appointmentEmployee = new AppointmentEmployee();

        appointmentEmployee.setEmployeeId( employee.getId() );
        appointmentEmployee.setName( employee.getName() );
        appointmentEmployee.setSurname( employee.getSurname() );

        appointmentEmployee.setRole( "Dr." );

        return appointmentEmployee;
    }

    @Override
    public AppointmentPatient toAppointmentPatient(Patient patient) {
        if ( patient == null ) {
            return null;
        }

        AppointmentPatient appointmentPatient = new AppointmentPatient();

        appointmentPatient.setPatientId( patient.getId() );
        appointmentPatient.setName( patient.getName() );
        appointmentPatient.setSurname( patient.getSurname() );
        appointmentPatient.setDateOfBirth( patient.getDateOfBirth() );
        appointmentPatient.setPhone( patient.getPhone() );
        appointmentPatient.setCreatedAt( patient.getCreatedAt() );

        return appointmentPatient;
    }

    protected com.monadent.domain.enums.AppointmentStatus appointmentStatusToAppointmentStatus(AppointmentStatus appointmentStatus) {
        if ( appointmentStatus == null ) {
            return null;
        }

        com.monadent.domain.enums.AppointmentStatus appointmentStatus1;

        switch ( appointmentStatus ) {
            case SCHEDULED: appointmentStatus1 = com.monadent.domain.enums.AppointmentStatus.SCHEDULED;
            break;
            case IN_PROGRESS: appointmentStatus1 = com.monadent.domain.enums.AppointmentStatus.IN_PROGRESS;
            break;
            case COMPLETED: appointmentStatus1 = com.monadent.domain.enums.AppointmentStatus.COMPLETED;
            break;
            case CANCELLED: appointmentStatus1 = com.monadent.domain.enums.AppointmentStatus.CANCELLED;
            break;
            case NO_SHOW: appointmentStatus1 = com.monadent.domain.enums.AppointmentStatus.NO_SHOW;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + appointmentStatus );
        }

        return appointmentStatus1;
    }

    protected AppointmentStatus appointmentStatusToAppointmentStatus1(com.monadent.domain.enums.AppointmentStatus appointmentStatus) {
        if ( appointmentStatus == null ) {
            return null;
        }

        AppointmentStatus appointmentStatus1;

        switch ( appointmentStatus ) {
            case SCHEDULED: appointmentStatus1 = AppointmentStatus.SCHEDULED;
            break;
            case IN_PROGRESS: appointmentStatus1 = AppointmentStatus.IN_PROGRESS;
            break;
            case COMPLETED: appointmentStatus1 = AppointmentStatus.COMPLETED;
            break;
            case CANCELLED: appointmentStatus1 = AppointmentStatus.CANCELLED;
            break;
            case NO_SHOW: appointmentStatus1 = AppointmentStatus.NO_SHOW;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + appointmentStatus );
        }

        return appointmentStatus1;
    }
}
