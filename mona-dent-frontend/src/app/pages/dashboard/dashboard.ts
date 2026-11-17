import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { auditTime, finalize } from 'rxjs';
import { LucideCalendarDays, LucideClock, LucidePlus, LucideUser } from '@lucide/angular';
import { PageHeader } from '../../components/page-header/page-header';
import { Container } from '../../components/container/container';
import { Button } from '../../components/custom-inputs/button/button';
import { AppointmentForm } from '../appointments/components/appointment-form/appointment-form';
import { PatientForm } from '../patients/components/patient-form/patient-form';
import { AppointmentResponse } from '../../core/models/Appointment';
import { AppointmentService } from '../../core/services/appointment-service';
import { BranchStore } from '../../core/stores/branch-store';
import { PatientResponse } from '../../core/models/Patient';
import { PatientService } from '../../core/services/patient-service';
import { UserStore } from '../../core/stores/user-store';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { LocalizedDatePipe } from '../../core/pipes/localized-date-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';
import { PatientLiveUpdatesService } from '../../core/services/patient-live-updates-service';

@Component({
  selector: 'app-dashboard',
  imports: [
    LucideUser,
    LucidePlus,
    LucideCalendarDays,
    LucideClock,
    PageHeader,
    Container,
    Button,
    AppointmentForm,
    PatientForm,
    TranslatePipe,
    LocalizedDatePipe,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly appointmentService = inject(AppointmentService);
  private readonly patientService = inject(PatientService);
  private readonly branchStore = inject(BranchStore);
  private readonly userStore = inject(UserStore);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly patientLiveUpdates = inject(PatientLiveUpdatesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(true);
  readonly appointmentsError = signal('');
  readonly currentDate = new Date();
  readonly isPatientsLoading = signal(true);
  readonly patientsError = signal('');
  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly patients = signal<PatientResponse[]>([]);

  readonly newPatientsThisMonth = computed(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

    return this.patients().filter((patient) => {
      const createdAt = Date.parse(patient.createdAt);
      return createdAt >= monthStart && createdAt < nextMonthStart;
    }).length;
  });

  isAppointmentOpen = false;
  isPatientOpen = false;

  constructor() {
    effect(() => {
      const branch = this.branchStore.selectedBranch();
      if (branch) {
        this.loadAppointments(branch.branchId);
      }
    });

    effect(() => {
      if (!this.branchStore.isLoading() && !this.branchStore.selectedBranch()) {
        this.appointments.set([]);
        this.isLoading.set(false);
      }
    });
  }

  ngOnInit(): void {
    this.branchStore.loadBranches();
    this.userStore.loadUser();
    this.loadPatients();
    this.patientLiveUpdates.changes$
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadPatients();
        const branch = this.branchStore.selectedBranch();
        if (branch) this.loadAppointments(branch.branchId);
      });
  }

  private loadPatients(): void {
    this.patientService
      .getPatients()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isPatientsLoading.set(false)))
      .subscribe({
        next: (patients) => {
          this.patientsError.set('');
          this.patients.set(patients);
        },
        error: (error) => {
          console.error(error);
          this.patients.set([]);
          this.patientsError.set(
            this.httpErrorService.message(error, 'Could not load patients.'),
          );
        },
      });
  }

  private loadAppointments(branchId: string): void {
    this.appointmentService
      .getAppointments(branchId, this.toLocalDateString(new Date()))
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (appointments) => {
          this.appointmentsError.set('');
          this.appointments.set(appointments);
        },
        error: (error) => {
          console.error(error);
          this.appointments.set([]);
          this.appointmentsError.set(
            this.httpErrorService.message(error, "Could not load today's appointments."),
          );
        },
      });
  }

  getUserName() {
    const user = this.userStore.user;

    if (user()) {
      return user()?.name;
    }

    return '';
  }

  formatTime(date: string): string {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  closeAppointmentPopup = () => {
    this.isAppointmentOpen = false;
  };

  openAppointmentPopup = () => {
    this.isAppointmentOpen = true;
  };

  closePatientPopup = () => {
    this.isPatientOpen = false;
  };

  openPatientPopup = () => {
    this.isPatientOpen = true;
  };

  onPatientCreated(patient: PatientResponse): void {
    this.patients.update((patients) => [patient, ...patients]);
  }

  onAppointmentSaved(appointment: AppointmentResponse): void {
    if (
      this.toLocalDateString(new Date(appointment.appointmentDate)) ===
      this.toLocalDateString(new Date())
    ) {
      this.appointments.update((appointments) => [...appointments, appointment]);
    }
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
