package com.monadent.infrastructure.mapper;

import com.monadent.contracts.users.CreateUserRequest;
import com.monadent.contracts.users.DoctorResponse;
import com.monadent.contracts.users.UpdateMeRequest;
import com.monadent.contracts.users.UpdateUserRequest;
import com.monadent.contracts.users.UserResponse;
import com.monadent.domain.models.entity.Branch;
import com.monadent.domain.models.entity.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

import java.util.Locale;
import java.util.UUID;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branches", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "preferredLanguage", ignore = true)
    @Mapping(target = "mustChangePassword", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    User toUser(CreateUserRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branches", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "preferredLanguage", ignore = true)
    @Mapping(target = "mustChangePassword", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateUser(UpdateUserRequest request, @MappingTarget User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "branches", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "passwordHash", ignore = true)
    @Mapping(target = "mustChangePassword", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateMe(UpdateMeRequest request, @MappingTarget User user);

    @Mapping(target = "userId", source = "id")
    @Mapping(target = "branchIds", source = "branches")
    UserResponse toUserResponse(User user);

    @Mapping(target = "doctorId", source = "id")
    DoctorResponse toDoctorResponse(User user);

    default UUID toBranchId(Branch branch) {
        return branch.getId();
    }

    default String toPreferredLanguageValue(UpdateMeRequest.PreferredLanguageEnum language) {
        return language == null ? null : language.getValue();
    }

    default UserResponse.PreferredLanguageEnum toPreferredLanguageEnum(String language) {
        return language == null
                ? null
                : UserResponse.PreferredLanguageEnum.fromValue(language.toLowerCase(Locale.ROOT));
    }
}
