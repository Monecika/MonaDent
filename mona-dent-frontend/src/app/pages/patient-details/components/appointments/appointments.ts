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
      SCHEDULED: 'Confirmed',
      IN_PROGRESS: 'In progress',
      COMPLETED: 'Completed',
      CANCELLED: 'Cancelled',
      NO_SHOW: 'No-show',
    };
    return labels[status];
  }
}
