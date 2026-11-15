package com.monadent.infrastructure.mapper;

import com.monadent.contracts.visits.CreateVisitRequest;
import com.monadent.contracts.visits.VisitResponse;
import com.monadent.contracts.visits.VisitStatus;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.User;
import com.monadent.domain.models.entity.Visit;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-15T16:58:19+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class VisitMapperImpl implements VisitMapper {

    @Override
    public Visit toVisit(CreateVisitRequest request) {
        if ( request == null ) {
            return null;
        }

        Visit visit = new Visit();

        visit.setBranchId( request.getBranchId() );
        visit.setPatientId( request.getPatientId() );
        visit.setDoctorId( request.getDoctorId() );
        visit.setAppointmentId( request.getAppointmentId() );
        visit.setVisitDate( request.getVisitDate() );
        if ( request.getDurationMinutes() != null ) {
            visit.setDurationMinutes( request.getDurationMinutes() );
        }
        visit.setDescription( request.getDescription() );
        visit.setNotes( request.getNotes() );

        return visit;
    }

    @Override
    public VisitResponse toResponse(Visit visit, Branch branch, User doctor) {
        if ( visit == null && branch == null && doctor == null ) {
            return null;
        }

        VisitResponse visitResponse = new VisitResponse();

        if ( visit != null ) {
            visitResponse.setVisitId( visit.getId() );
            visitResponse.setStatus( visitStatusToVisitStatus( visit.getStatus() ) );
            visitResponse.setPatientId( visit.getPatientId() );
            visitResponse.setAppointmentId( visit.getAppointmentId() );
            visitResponse.setVisitDate( visit.getVisitDate() );
            visitResponse.setDurationMinutes( visit.getDurationMinutes() );
            visitResponse.setDescription( visit.getDescription() );
            visitResponse.setNotes( visit.getNotes() );
        }
        if ( branch != null ) {
            visitResponse.setBranchName( branch.getName() );
        }
        if ( doctor != null ) {
            visitResponse.setDoctorName( doctor.getName() );
            visitResponse.setDoctorSurname( doctor.getSurname() );
        }
        visitResponse.setDoctorRole( "Dr." );

        return visitResponse;
    }

    protected VisitStatus visitStatusToVisitStatus(com.monadent.domain.enums.VisitStatus visitStatus) {
        if ( visitStatus == null ) {
            return null;
        }

        VisitStatus visitStatus1;

        switch ( visitStatus ) {
            case IN_PROGRESS: visitStatus1 = VisitStatus.IN_PROGRESS;
            break;
            case COMPLETED: visitStatus1 = VisitStatus.COMPLETED;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + visitStatus );
        }

        return visitStatus1;
    }
}
