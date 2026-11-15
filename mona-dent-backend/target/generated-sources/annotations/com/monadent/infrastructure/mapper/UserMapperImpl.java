package com.monadent.infrastructure.mapper;

import com.monadent.contracts.users.CreateUserRequest;
import com.monadent.contracts.users.DoctorResponse;
import com.monadent.contracts.users.Role;
import com.monadent.contracts.users.UpdateMeRequest;
import com.monadent.contracts.users.UpdateUserRequest;
import com.monadent.contracts.users.UserResponse;
import com.monadent.contracts.users.UserStatus;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-11-15T16:58:19+0100",
    comments = "version: 1.6.3, compiler: javac, environment: Java 25.0.2 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public User toUser(CreateUserRequest request) {
        if ( request == null ) {
            return null;
        }

        User user = new User();

        user.setName( request.getName() );
        user.setSurname( request.getSurname() );
        user.setEmail( request.getEmail() );
        user.setPhone( request.getPhone() );
        user.setDateOfBirth( request.getDateOfBirth() );
        user.setCalendarColor( request.getCalendarColor() );
        user.setRole( roleToRole( request.getRole() ) );

        return user;
    }

    @Override
    public void updateUser(UpdateUserRequest request, User user) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            user.setName( request.getName() );
        }
        if ( request.getSurname() != null ) {
            user.setSurname( request.getSurname() );
        }
        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
        if ( request.getDateOfBirth() != null ) {
            user.setDateOfBirth( request.getDateOfBirth() );
        }
        if ( request.getCalendarColor() != null ) {
            user.setCalendarColor( request.getCalendarColor() );
        }
        if ( request.getRole() != null ) {
            user.setRole( roleToRole( request.getRole() ) );
        }
        if ( request.getStatus() != null ) {
            user.setStatus( userStatusToUserStatus( request.getStatus() ) );
        }
    }

    @Override
    public void updateMe(UpdateMeRequest request, User user) {
        if ( request == null ) {
            return;
        }

        if ( request.getName() != null ) {
            user.setName( request.getName() );
        }
        if ( request.getSurname() != null ) {
            user.setSurname( request.getSurname() );
        }
        if ( request.getEmail() != null ) {
            user.setEmail( request.getEmail() );
        }
        if ( request.getPhone() != null ) {
            user.setPhone( request.getPhone() );
        }
        if ( request.getDateOfBirth() != null ) {
            user.setDateOfBirth( request.getDateOfBirth() );
        }
        if ( request.getCalendarColor() != null ) {
            user.setCalendarColor( request.getCalendarColor() );
        }
        if ( request.getPreferredLanguage() != null ) {
            user.setPreferredLanguage( toPreferredLanguageValue( request.getPreferredLanguage() ) );
        }
    }

    @Override
    public UserResponse toUserResponse(User user) {
        if ( user == null ) {
            return null;
        }

        UserResponse userResponse = new UserResponse();

        userResponse.setUserId( user.getId() );
        userResponse.setBranchIds( branchSetToUUIDList( user.getBranches() ) );
        userResponse.setName( user.getName() );
        userResponse.setSurname( user.getSurname() );
        userResponse.setEmail( user.getEmail() );
        userResponse.setPhone( user.getPhone() );
        userResponse.setDateOfBirth( user.getDateOfBirth() );
        userResponse.setCalendarColor( user.getCalendarColor() );
        userResponse.setRole( roleToRole1( user.getRole() ) );
        userResponse.setStatus( userStatusToUserStatus1( user.getStatus() ) );
        userResponse.setPreferredLanguage( toPreferredLanguageEnum( user.getPreferredLanguage() ) );

        return userResponse;
    }

    @Override
    public DoctorResponse toDoctorResponse(User user) {
        if ( user == null ) {
            return null;
        }

        DoctorResponse doctorResponse = new DoctorResponse();

        doctorResponse.setDoctorId( user.getId() );
        doctorResponse.setName( user.getName() );
        doctorResponse.setSurname( user.getSurname() );
        doctorResponse.setCalendarColor( user.getCalendarColor() );

        return doctorResponse;
    }

    protected com.monadent.domain.enums.Role roleToRole(Role role) {
        if ( role == null ) {
            return null;
        }

        com.monadent.domain.enums.Role role1;

        switch ( role ) {
            case ADMIN: role1 = com.monadent.domain.enums.Role.ADMIN;
            break;
            case DOCTOR: role1 = com.monadent.domain.enums.Role.DOCTOR;
            break;
            case RECEPTIONIST: role1 = com.monadent.domain.enums.Role.RECEPTIONIST;
            break;
            case ASSISTANT: role1 = com.monadent.domain.enums.Role.ASSISTANT;
            break;
            case MANAGER: role1 = com.monadent.domain.enums.Role.MANAGER;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + role );
        }

        return role1;
    }

    protected com.monadent.domain.enums.UserStatus userStatusToUserStatus(UserStatus userStatus) {
        if ( userStatus == null ) {
            return null;
        }

        com.monadent.domain.enums.UserStatus userStatus1;

        switch ( userStatus ) {
            case ACTIVE: userStatus1 = com.monadent.domain.enums.UserStatus.ACTIVE;
            break;
            case INACTIVE: userStatus1 = com.monadent.domain.enums.UserStatus.INACTIVE;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + userStatus );
        }

        return userStatus1;
    }

    protected List<UUID> branchSetToUUIDList(Set<Branch> set) {
        if ( set == null ) {
            return null;
        }

        List<UUID> list = new ArrayList<UUID>( set.size() );
        for ( Branch branch : set ) {
            list.add( toBranchId( branch ) );
        }

        return list;
    }

    protected Role roleToRole1(com.monadent.domain.enums.Role role) {
        if ( role == null ) {
            return null;
        }

        Role role1;

        switch ( role ) {
            case ADMIN: role1 = Role.ADMIN;
            break;
            case DOCTOR: role1 = Role.DOCTOR;
            break;
            case RECEPTIONIST: role1 = Role.RECEPTIONIST;
            break;
            case ASSISTANT: role1 = Role.ASSISTANT;
            break;
            case MANAGER: role1 = Role.MANAGER;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + role );
        }

        return role1;
    }

    protected UserStatus userStatusToUserStatus1(com.monadent.domain.enums.UserStatus userStatus) {
        if ( userStatus == null ) {
            return null;
        }

        UserStatus userStatus1;

        switch ( userStatus ) {
            case ACTIVE: userStatus1 = UserStatus.ACTIVE;
            break;
            case INACTIVE: userStatus1 = UserStatus.INACTIVE;
            break;
            default: throw new IllegalArgumentException( "Unexpected enum constant: " + userStatus );
        }

        return userStatus1;
    }
}
