import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { LucideDownload, LucidePencil } from '@lucide/angular';
import {
  auditTime,
  EMPTY,
  catchError,
  distinctUntilChanged,
  filter,
  finalize,
  forkJoin,
  map,
  of,
  switchMap,
  Subject,
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
import { PageHeader } from '../../components/page-header/page-header';
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
import { PatientLiveUpdatesService } from '../../core/services/patient-live-updates-service';
import { PatientMedicalRecordPdfService } from '../../core/services/patient-medical-record-pdf-service';
import { LanguageCode, LanguageService } from '../../core/services/language-service';
import { CustomCalendar } from '../../components/custom-inputs/custom-calendar/custom-calendar';
import { CustomSelectInput, SelectOption } from '../../components/custom-inputs/custom-select-input/custom-select-input';

@Component({
  selector: 'app-patient-details',
  imports: [
    Button,
    CustomCalendar,
    CustomSelectInput,
    Container,
    LocalizedDatePipe,
    LucideDownload,
    LucidePencil,
    PageHeader,
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
  private readonly patientLiveUpdates = inject(PatientLiveUpdatesService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly medicalRecordPdfService = inject(PatientMedicalRecordPdfService);
  private readonly languageService = inject(LanguageService);

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
  readonly medicalRecordLanguage = signal<LanguageCode>('ro');
  readonly medicalRecordDateFrom = signal('');
  readonly medicalRecordDateTo = signal('');
  readonly medicalRecordError = signal('');
  readonly isGeneratingMedicalRecord = signal(false);
  readonly medicalRecordLanguageOptions: SelectOption[] = [
    { value: 'ro', label: 'Romanian' },
    { value: 'ru', label: 'Russian' },
    { value: 'en', label: 'English' },
  ];
  private readonly patientReloads = new Subject<string>();
  private currentPatientId: string | null = null;

  constructor() {
    this.patientReloads
      .pipe(
        switchMap((patientId) => {
          this.isLoading.set(true);
          this.errorMessage.set('');
          this.toothError.set('');
          this.toothHistoryError.set('');
          this.toothHistory.set([]);

          return forkJoin({
            patient: this.patientService.getPatient(patientId),
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
            map(({ patient, appointments, visits, teeth, toothHistory }) => ({
              patient,
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

    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((patientId): patientId is string => patientId !== null),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((patientId) => {
        if (this.currentPatientId !== patientId) this.initialTeeth.set([]);
        this.currentPatientId = patientId;
        this.patientReloads.next(patientId);
      });

    this.patientLiveUpdates.changes$
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.currentPatientId) this.patientReloads.next(this.currentPatientId);
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
    this.medicalRecordLanguage.set(this.languageService.language());
    this.medicalRecordError.set('');
    this.isMedicalRecordOptionsOpen.set(true);
  }

  setMedicalRecordLanguage(value: string): void {
    if (value === 'ro' || value === 'ru' || value === 'en') this.medicalRecordLanguage.set(value);
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
      teeth: this.patientToothService.getPatientTeeth(patient.patientId),
      history: this.patientToothService.getPatientToothHistory(patient.patientId),
    }).pipe(
      finalize(() => this.isGeneratingMedicalRecord.set(false)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: ({ teeth, history }) => {
        if (printWindow.closed) return;
        try {
          this.medicalRecordPdfService.writePrintView(
            printWindow,
            patient,
            this.visits(),
            teeth,
            history,
            this.medicalRecordLanguage(),
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
          'Could not load the patient dental history for the report.',
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
