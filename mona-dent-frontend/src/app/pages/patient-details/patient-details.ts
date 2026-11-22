import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LucideDownload, LucidePencil } from '@lucide/angular';
import {
  EMPTY,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
} from 'rxjs';
import { AppointmentResponse } from '../../core/models/Appointment';
import { PatientResponse } from '../../core/models/Patient';
import { AppointmentService } from '../../core/services/appointment-service';
import { PatientService } from '../../core/services/patient-service';
import { VisitResponse } from '../../core/models/Visit';
import { VisitService } from '../../core/services/visit-service';
import { PatientToothHistoryResponse, PatientToothResponse } from '../../core/models/PatientTooth';
import { PatientToothService } from '../../core/services/patient-tooth-service';
import { Button } from '../../components/custom-inputs/button/button';
import { Container } from '../../components/container/container';
import { Overview } from './components/overview/overview';
import { Visits } from './components/visits/visits';
import { Appointments } from './components/appointments/appointments';
import { Files } from './components/files/files';
import {
  AppointmentForm,
  AppointmentFormData,
} from '../appointments/components/appointment-form/appointment-form';
import { VisitForm } from './components/visits/visit-form';
import { PatientForm } from '../patients/components/patient-form/patient-form';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { LocalizedDatePipe } from '../../core/pipes/localized-date-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';
import { PatientMedicalRecordPdfService } from '../../core/services/patient-medical-record-pdf-service';
import { OrganizationService } from '../../core/services/organization-service';
import { CustomCalendar } from '../../components/custom-inputs/custom-calendar/custom-calendar';

@Component({
  selector: 'app-patient-details',
  imports: [
    Button,
    CustomCalendar,
    Container,
    LocalizedDatePipe,
    LucideDownload,
    LucidePencil,
    Overview,
    Visits,
    Appointments,
    Files,
    AppointmentForm,
    VisitForm,
    PatientForm,
    TranslatePipe,
  ],
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.css',
})
export class PatientDetails {
  private readonly route = inject(ActivatedRoute);
  private readonly patientService = inject(PatientService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly visitService = inject(VisitService);
  private readonly patientToothService = inject(PatientToothService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly medicalRecordPdfService = inject(PatientMedicalRecordPdfService);
  private readonly organizationService = inject(OrganizationService);

  readonly tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Visits', value: 'visits' },
    { label: 'Appointments', value: 'appointments' },
    { label: 'Files & X-rays', value: 'files' },
  ];

  activeTab = 'overview';
  readonly toothHistory = signal<PatientToothHistoryResponse[]>([]);
  readonly toothHistoryError = signal('');
  readonly toothError = signal('');
  readonly isLoading = signal(true);
  readonly patient = signal<PatientResponse | null>(null);
  readonly appointments = signal<AppointmentResponse[]>([]);
  readonly visits = signal<VisitResponse[]>([]);
  readonly isAppointmentFormOpen = signal(false);
  readonly appointmentFormData = signal<AppointmentFormData | null>(null);
  readonly isVisitFormOpen = signal(false);
  readonly isPatientFormOpen = signal(false);
  readonly errorMessage = signal('');
  readonly initialTeeth = signal<PatientToothResponse[]>([]);
  readonly isMedicalRecordOptionsOpen = signal(false);
  readonly medicalRecordDateFrom = signal('');
  readonly medicalRecordDateTo = signal('');
  readonly medicalRecordError = signal('');
  readonly isGeneratingMedicalRecord = signal(false);

  constructor() {
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((patientId): patientId is string => patientId !== null),
        distinctUntilChanged(),
        switchMap((patientId) => {
          this.isLoading.set(true);
          this.errorMessage.set('');
          this.toothError.set('');
          this.toothHistoryError.set('');
          this.toothHistory.set([]);
          this.initialTeeth.set([]);

          return forkJoin({
            patients: this.patientService.getPatients(),
            appointments: this.appointmentService.getPatientAppointments(patientId),
            visits: this.visitService.getPatientVisits(patientId),
            teeth: this.patientToothService.getPatientTeeth(patientId).pipe(
              catchError((error) => {
                console.error('Failed to load patient teeth:', error);
                this.toothError.set(
                  this.httpErrorService.message(error, 'Could not load the odontogram.'),
                );
                return of([] as PatientToothResponse[]);
              }),
            ),
            toothHistory: this.patientToothService.getPatientToothHistory(patientId).pipe(
              catchError((error) => {
                console.error('Failed to load patient tooth history:', error);
                this.toothHistoryError.set(
                  this.httpErrorService.message(error, 'Could not load tooth history.'),
                );
                return of([] as PatientToothHistoryResponse[]);
              }),
            ),
          }).pipe(
            map(({ patients, appointments, visits, teeth, toothHistory }) => ({
              patient: patients.find((item) => item.patientId === patientId) ?? null,
              appointments,
              visits,
              teeth,
              toothHistory,
            })),
            catchError((error) => {
              console.error('Failed to load patient details:', error);
              this.errorMessage.set(
                this.httpErrorService.message(
                  error,
                  'Could not load patient details. Please try again.',
                ),
              );
              return EMPTY;
            }),
            finalize(() => this.isLoading.set(false)),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ patient, appointments, visits, teeth, toothHistory }) => {
        this.patient.set(patient);
        this.appointments.set(appointments);
        this.visits.set(visits);
        this.toothHistory.set(toothHistory);
        this.initialTeeth.set(teeth);
        if (!patient) this.errorMessage.set('Patient not found.');
      });
  }

  getInitials(patient: PatientResponse): string {
    return `${patient.name.charAt(0)}${patient.surname.charAt(0)}`.toUpperCase();
  }

  openAppointmentForm(patient: PatientResponse): void {
    this.appointmentFormData.set({
      patientId: patient.patientId,
      patientName: `${patient.name} ${patient.surname}`,
      date: new Date(),
      time: '',
      duration: '30',
    });
    this.isAppointmentFormOpen.set(true);
  }

  openEditAppointment(appointment: AppointmentResponse): void {
    const date = new Date(appointment.appointmentDate);
    this.appointmentFormData.set({
      id: appointment.appointmentId,
      patientId: appointment.patient.patientId,
      patientName: `${appointment.patient.name} ${appointment.patient.surname}`,
      date,
      time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      duration: String(appointment.durationMinutes),
      doctorId: appointment.employee.employeeId,
      doctorName: `${appointment.employee.name} ${appointment.employee.surname}`,
      reason: appointment.description,
      notes: appointment.notes,
      status: appointment.status,
    });
    this.isAppointmentFormOpen.set(true);
  }

  onAppointmentSaved(appointment: AppointmentResponse): void {
    this.appointments.update((appointments) => {
      const existingIndex = appointments.findIndex(
        (item) => item.appointmentId === appointment.appointmentId,
      );
      if (existingIndex < 0) return [...appointments, appointment];

      return appointments.map((item) =>
        item.appointmentId === appointment.appointmentId ? appointment : item,
      );
    });
  }

  onAppointmentDeleted(appointmentId: string): void {
    this.appointments.update((appointments) =>
      appointments.filter((appointment) => appointment.appointmentId !== appointmentId),
    );
    this.isAppointmentFormOpen.set(false);
    this.appointmentFormData.set(null);
  }

  onVisitSaved(visit: VisitResponse): void {
    this.visits.update((visits) => [...visits, visit]);
  }

  onPatientUpdated(patient: PatientResponse): void {
    const birthDateChanged = this.patient()?.dateOfBirth !== patient.dateOfBirth;
    this.patient.set(patient);
    if (!birthDateChanged) return;

    forkJoin({
      teeth: this.patientToothService.getPatientTeeth(patient.patientId).pipe(
        catchError((error) => {
          this.toothError.set(this.httpErrorService.message(error, 'Could not load the odontogram.'));
          return of([] as PatientToothResponse[]);
        }),
      ),
      history: this.patientToothService.getPatientToothHistory(patient.patientId).pipe(
        catchError((error) => {
          this.toothHistoryError.set(this.httpErrorService.message(error, 'Could not load tooth history.'));
          return of([] as PatientToothHistoryResponse[]);
        }),
      ),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(({ teeth, history }) => {
      this.initialTeeth.set(teeth);
      this.toothHistory.set(history);
    });
  }

  openMedicalRecordOptions(): void {
    this.medicalRecordError.set('');
    this.isMedicalRecordOptionsOpen.set(true);
  }

  setMedicalRecordDateFrom(date: Date): void {
    this.medicalRecordDateFrom.set(this.toLocalDateString(date));
  }

  setMedicalRecordDateTo(date: Date): void {
    this.medicalRecordDateTo.set(this.toLocalDateString(date));
  }

  clearMedicalRecordDateFrom(): void {
    this.medicalRecordDateFrom.set('');
  }

  clearMedicalRecordDateTo(): void {
    this.medicalRecordDateTo.set('');
  }

  isMedicalRecordDateRangeInvalid(): boolean {
    const from = this.medicalRecordDateFrom();
    const to = this.medicalRecordDateTo();
    return !!from && !!to && from > to;
  }

  generateMedicalRecord(patient: PatientResponse): void {
    const from = this.medicalRecordDateFrom();
    const to = this.medicalRecordDateTo();
    if (this.isMedicalRecordDateRangeInvalid() || this.isGeneratingMedicalRecord()) {
      this.medicalRecordError.set('Start date must be before the end date.');
      return;
    }
    this.medicalRecordError.set('');
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.medicalRecordError.set('Could not open the PDF print window. Allow pop-ups and try again.');
      return;
    }
    this.isMedicalRecordOptionsOpen.set(false);
    this.isGeneratingMedicalRecord.set(true);
    printWindow.document.write('<!doctype html><title>Preparing medical record</title><p>Preparing medical record…</p>');
    forkJoin({
      organization: this.organizationService.getOrganization(),
      teeth: this.patientToothService.getPatientTeeth(patient.patientId),
      history: this.patientToothService.getPatientToothHistory(patient.patientId),
    }).pipe(
      finalize(() => this.isGeneratingMedicalRecord.set(false)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: ({ organization, teeth, history }) => {
        if (printWindow.closed) return;
        if (!organization.name.trim() || !organization.idno.trim()) {
          printWindow.close();
          this.medicalRecordError.set('Set the organization name and IDNO before generating the medical record.');
          this.isMedicalRecordOptionsOpen.set(true);
          return;
        }
        try {
          this.medicalRecordPdfService.writePrintView(
            printWindow,
            patient,
            organization,
            this.visits(),
            teeth,
            history,
            from,
            to,
          );
        } catch (error) {
          console.error('Failed to generate the patient medical record:', error);
          printWindow.close();
          this.medicalRecordError.set('Could not generate the medical record. Please try again.');
          this.isMedicalRecordOptionsOpen.set(true);
        }
      },
      error: (error) => {
        printWindow.close();
        this.medicalRecordError.set(this.httpErrorService.message(
          error,
          'Could not load organization or patient details for the report.',
        ));
        this.isMedicalRecordOptionsOpen.set(true);
      },
    });
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
