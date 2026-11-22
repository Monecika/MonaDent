import { Component, computed, input, output } from '@angular/core';
import { LucideCalendarDays, LucidePencil, LucidePlus } from '@lucide/angular';
import { AppointmentResponse, AppointmentStatus } from '../../../../core/models/Appointment';
import { Container } from '../../../../components/container/container';
import { Button } from '../../../../components/custom-inputs/button/button';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { LocalizedDatePipe } from '../../../../core/pipes/localized-date-pipe';

@Component({
  selector: 'app-appointments',
  imports: [Container, LocalizedDatePipe, LucideCalendarDays, LucidePencil, Button, LucidePlus, TranslatePipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  readonly appointments = input<AppointmentResponse[]>([]);
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly create = output<void>();
  readonly edit = output<AppointmentResponse>();

  readonly sortedAppointments = computed(() =>
    [...this.appointments()].sort(
      (a, b) => Date.parse(a.appointmentDate) - Date.parse(b.appointmentDate),
    ),
  );

  statusLabel(status: AppointmentStatus): string {
    const labels: Record<AppointmentStatus, string> = {
      SCHEDULED: 'Scheduled',
      IN_PROGRESS: 'In progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      NO_SHOW: 'No-show',
    };
    return labels[status];
  }

  statusClasses(status: AppointmentStatus): string {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800';
      case 'IN_PROGRESS':
        return 'bg-amber-100 text-amber-800';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-700';
      case 'NO_SHOW':
        return 'bg-red-100 text-red-800';
      case 'SCHEDULED':
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  statusDotClasses(status: AppointmentStatus): string {
    switch (status) {
      case 'COMPLETED':
        return 'bg-emerald-500 ring-emerald-100';
      case 'IN_PROGRESS':
        return 'bg-amber-500 ring-amber-100';
      case 'CANCELLED':
        return 'bg-rose-400 ring-rose-100';
      case 'NO_SHOW':
        return 'bg-red-600 ring-red-100';
      case 'SCHEDULED':
      default:
        return 'bg-blue-600 ring-blue-100';
    }
  }
}
