import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime } from 'rxjs';
import { PageHeader } from '../../components/page-header/page-header';
import { CalendarComponent } from './components/calendar/calendar';
import { Button } from '../../components/custom-inputs/button/button';
import { LucidePlus } from '@lucide/angular';
import { AppointmentForm } from './components/appointment-form/appointment-form';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { PatientLiveUpdatesService } from '../../core/services/patient-live-updates-service';

@Component({
  selector: 'app-appointments',
  imports: [PageHeader, CalendarComponent, Button, LucidePlus, AppointmentForm, TranslatePipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments implements OnInit {
  private readonly patientLiveUpdates = inject(PatientLiveUpdatesService);
  private readonly destroyRef = inject(DestroyRef);
  @ViewChild(CalendarComponent)
  private calendar?: CalendarComponent;

  isFormOpen = false;

  ngOnInit(): void {
    this.patientLiveUpdates.changes$
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.calendar?.refreshAppointments());
  }

  openForm = () => {
    this.isFormOpen = true;
  };

  closeForm = () => {
    this.isFormOpen = false;
  };

  onAppointmentSaved(): void {
    this.calendar?.refreshAppointments();
  }
}
