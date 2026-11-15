package com.monadent.infrastructure.mapper;

import com.monadent.contracts.visits.CreateVisitRequest;
import com.monadent.contracts.visits.VisitResponse;
import com.monadent.domain.models.entity.Visit;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VisitMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Visit toVisit(CreateVisitRequest request);

    @Mapping(target = "visitId", source = "visit.id")
    @Mapping(target = "branchName", source = "branch.name")
    @Mapping(target = "doctorRole", constant = "Dr.")
    @Mapping(target = "doctorName", source = "doctor.name")
    @Mapping(target = "doctorSurname", source = "doctor.surname")
    @Mapping(target = "status", source = "visit.status")
    VisitResponse toResponse(Visit visit, Branch branch, User doctor);
}
