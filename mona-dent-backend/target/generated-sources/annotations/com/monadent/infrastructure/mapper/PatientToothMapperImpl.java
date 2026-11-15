package com.monadent.infrastructure.mapper;

import com.monadent.contracts.teeth.CreatePatientToothRequest;
import com.monadent.contracts.teeth.PatientToothResponse;
import com.monadent.contracts.teeth.UpdatePatientToothRequest;
import com.monadent.domain.enums.ToothFinding;
import com.monadent.domain.enums.ToothType;
import com.monadent.domain.models.entity.PatientTooth;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-15T16:58:19+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class PatientToothMapperImpl implements PatientToothMapper {

    @Override
    public PatientTooth toPatientTooth(CreatePatientToothRequest request) {
        if ( request == null ) {
            return null;
        }

        PatientTooth patientTooth = new PatientTooth();

        if ( request.getToothNumber() != null ) {
            patientTooth.setToothNumber( request.getToothNumber() );
        }
        patientTooth.setToothType( toothTypeToToothType( request.getToothType() ) );
        patientTooth.setFindings( toothFindingListToToothFindingList( request.getFindings() ) );
        patientTooth.setMobilityGrade( request.getMobilityGrade() );
        patientTooth.setNotes( request.getNotes() );

        return patientTooth;
    }

    @Override
    public void updatePatientTooth(UpdatePatientToothRequest request, PatientTooth patientTooth) {
        if ( request == null ) {
            return;
        }

        if ( patientTooth.getFindings() != null ) {
            List<ToothFinding> list = toothFindingListToToothFindingList( request.getFindings() );
            if ( list != null ) {
                patientTooth.getFindings().clear();
                patientTooth.getFindings().addAll( list );
            }
        }
        else {
            List<ToothFinding> list = toothFindingListToToothFindingList( request.getFindings() );
            if ( list != null ) {
                patientTooth.setFindings( list );
            }
        }
        if ( request.getMobilityGrade() != null ) {
            patientTooth.setMobilityGrade( request.getMobilityGrade() );
        }
        if ( request.getNotes() != null ) {
            patientTooth.setNotes( request.getNotes() );
        }
    }

    @Override
    public PatientToothResponse toResponse(PatientTooth patientTooth) {
        if ( patientTooth == null ) {
            return null;
        }

        PatientToothResponse patientToothResponse = new PatientToothResponse();

        patientToothResponse.setToothId( patientTooth.getId() );
        patientToothResponse.setPatientId( patientTooth.getPatientId() );
        patientToothResponse.setToothNumber( patientTooth.getToothNumber() );
        patientToothResponse.setToothType( toothTypeToToothType1( patientTooth.getToothType() ) );
        patientToothResponse.setFindings( toothFindingListToToothFindingList1( patientTooth.getFindings() ) );
        patientToothResponse.setMobilityGrade( patientTooth.getMobilityGrade() );
        patientToothResponse.setNotes( patientTooth.getNotes() );
        patientToothResponse.setUpdatedBy( patientTooth.getUpdatedBy() );
        patientToothResponse.setUpdatedAt( patientTooth.getUpdatedAt() );

        return patientToothResponse;
    }

    protected ToothType toothTypeToToothType(com.monadent.contracts.teeth.ToothType toothType) {
        if ( toothType == null ) {
            return null;
        }

        ToothType toothType1;

        switch ( toothType ) {
            case PRIMARY: toothType1 = ToothType.PRIMARY;
            break;
            case PERMANENT: toothType1 = ToothType.PERMANENT;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + toothType );
        }

        return toothType1;
    }

    protected ToothFinding toothFindingToToothFinding(com.monadent.contracts.teeth.ToothFinding toothFinding) {
        if ( toothFinding == null ) {
            return null;
        }

        ToothFinding toothFinding1;

        switch ( toothFinding ) {
            case NOT_ASSESSED: toothFinding1 = ToothFinding.NOT_ASSESSED;
            break;
            case HEALTHY: toothFinding1 = ToothFinding.HEALTHY;
            break;
            case CARIES: toothFinding1 = ToothFinding.CARIES;
            break;
            case PULPITIS: toothFinding1 = ToothFinding.PULPITIS;
            break;
            case PERIODONTITIS: toothFinding1 = ToothFinding.PERIODONTITIS;
            break;
            case PERIODONTAL_DISEASE: toothFinding1 = ToothFinding.PERIODONTAL_DISEASE;
            break;
            case ROOT_PROBLEM: toothFinding1 = ToothFinding.ROOT_PROBLEM;
            break;
            case FILLING: toothFinding1 = ToothFinding.FILLING;
            break;
            case CROWN: toothFinding1 = ToothFinding.CROWN;
            break;
            case IMPLANT: toothFinding1 = ToothFinding.IMPLANT;
            break;
            case MISSING: toothFinding1 = ToothFinding.MISSING;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + toothFinding );
        }

        return toothFinding1;
    }

    protected List<ToothFinding> toothFindingListToToothFindingList(List<com.monadent.contracts.teeth.ToothFinding> list) {
        if ( list == null ) {
            return null;
        }

        List<ToothFinding> list1 = new ArrayList<ToothFinding>( list.size() );
        for ( com.monadent.contracts.teeth.ToothFinding toothFinding : list ) {
            list1.add( toothFindingToToothFinding( toothFinding ) );
        }

        return list1;
    }

    protected com.monadent.contracts.teeth.ToothType toothTypeToToothType1(ToothType toothType) {
        if ( toothType == null ) {
            return null;
        }

        com.monadent.contracts.teeth.ToothType toothType1;

        switch ( toothType ) {
            case PRIMARY: toothType1 = com.monadent.contracts.teeth.ToothType.PRIMARY;
            break;
            case PERMANENT: toothType1 = com.monadent.contracts.teeth.ToothType.PERMANENT;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + toothType );
        }

        return toothType1;
    }

    protected com.monadent.contracts.teeth.ToothFinding toothFindingToToothFinding1(ToothFinding toothFinding) {
        if ( toothFinding == null ) {
            return null;
        }

        com.monadent.contracts.teeth.ToothFinding toothFinding1;

        switch ( toothFinding ) {
            case NOT_ASSESSED: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.NOT_ASSESSED;
            break;
            case HEALTHY: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.HEALTHY;
            break;
            case CARIES: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.CARIES;
            break;
            case PULPITIS: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.PULPITIS;
            break;
            case PERIODONTITIS: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.PERIODONTITIS;
            break;
            case PERIODONTAL_DISEASE: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.PERIODONTAL_DISEASE;
            break;
            case ROOT_PROBLEM: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.ROOT_PROBLEM;
            break;
            case FILLING: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.FILLING;
            break;
            case CROWN: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.CROWN;
            break;
            case IMPLANT: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.IMPLANT;
            break;
            case MISSING: toothFinding1 = com.monadent.contracts.teeth.ToothFinding.MISSING;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + toothFinding );
        }

        return toothFinding1;
    }

    protected List<com.monadent.contracts.teeth.ToothFinding> toothFindingListToToothFindingList1(List<ToothFinding> list) {
        if ( list == null ) {
            return null;
        }

        List<com.monadent.contracts.teeth.ToothFinding> list1 = new ArrayList<com.monadent.contracts.teeth.ToothFinding>( list.size() );
        for ( ToothFinding toothFinding : list ) {
            list1.add( toothFindingToToothFinding1( toothFinding ) );
        }

        return list1;
    }
}
