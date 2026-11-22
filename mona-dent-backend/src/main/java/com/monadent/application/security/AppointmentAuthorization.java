package com.monadent.application.security;

import com.monadent.domain.models.entity.Appointment;
import com.monadent.domain.models.security.CustomUserDetails;
import com.monadent.infrastructure.persistence.AppointmentJpaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component("appointmentAuthorization")
@RequiredArgsConstructor
public class AppointmentAuthorization {
    private final AppointmentJpaRepository appointmentJpaRepository;

    public boolean canAccessBranch(UUID branchId) {
        CustomUserDetails actor = currentUser();
        return actor != null
                && branchId != null
                && (isAdmin(actor) || actor.getBranchIds().contains(branchId));
    }

    public boolean canManageAppointment(UUID appointmentId) {
        CustomUserDetails actor = currentUser();
        if (actor == null || appointmentId == null) {
            return false;
        }
        if (isAdmin(actor)) {
            return true;
        }

        Appointment appointment = appointmentJpaRepository.findById(appointmentId).orElse(null);
        if (appointment == null) {
            return true;
        }
        return actor.getBranchIds().contains(appointment.getBranchId());
    }

    private CustomUserDetails currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof CustomUserDetails userDetails)) {
            return null;
        }
        return userDetails;
    }

    private boolean isAdmin(CustomUserDetails user) {
        return "ADMIN".equals(user.getRole());
    }
}
