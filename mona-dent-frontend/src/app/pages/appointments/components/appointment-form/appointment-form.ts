import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import {
  catchError,
  EMPTY,
  filter,
  finalize,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

import {
  CustomSelectInput,
  SelectOption,
} from '../../../../components/custom-inputs/custom-select-input/custom-select-input';
import { CustomCalendar } from '../../../../components/custom-inputs/custom-calendar/custom-calendar';
import { BaseForm } from '../../../../components/base-form/base-form';
import { ConfirmationDialog } from '../../../../components/confirmation-dialog/confirmation-dialog';
import { PatientService } from '../../../../core/services/patient-service';
import {
  CreatePatientRequest,
  PatientGender,
  PatientResponse,
} from '../../../../core/models/Patient';
import { UserService } from '../../../../core/services/user-service';
import { BranchStore } from '../../../../core/stores/branch-store';
import { AppointmentService } from '../../../../core/services/appointment-service';
import {
  AppointmentResponse,
  AppointmentStatus,
  CreateAppointmentRequest,
} from '../../../../core/models/Appointment';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { LanguageService } from '../../../../core/services/language-service';
import { HttpErrorService } from '../../../../core/services/http-error-service';

export interface AppointmentFormData {
  id?: string;
  patientId?: string;
  patientName?: string;
  date: Date;
  time: string;
  duration: string;
  doctorId?: string;
  doctorName?: string;
  reason?: string;
  notes?: string;
  status?: AppointmentStatus;
}

@Component({
  selector: 'app-appointment-form',
  imports: [ReactiveFormsModule, BaseForm, CustomSelectInput, CustomCalendar, ConfirmationDialog, TranslatePipe],
  templateUrl: './appointment-form.html',
  styleUrl: './appointment-form.css',
})
export class AppointmentForm implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly fb = inject(FormBuilder);
  private readonly languageService = inject(LanguageService);
  private readonly patientService = inject(PatientService);
  private readonly userService = inject(UserService);
  private readonly branchStore = inject(BranchStore);
  private readonly appointmentService = inject(AppointmentService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpErrorService = inject(HttpErrorService);

  private readonly selectedBranch$ = toObservable(this.branchStore.selectedBranch);

  data = input<AppointmentFormData | null>(null);
  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  close = output<void>();
  saved = output<AppointmentResponse>();
  patientCreated = output<PatientResponse>();
  delete = output<string>();

  appointmentId: string | null = null;
  isDeleting = false;
  isDeleteConfirmOpen = false;
  deleteError = '';
  validationError = '';
  readonly currentYear = new Date().getFullYear();

  readonly form = this.fb.nonNullable.group({
    isPatientNotRegistered: [false],
    patientId: ['', Validators.required],
    newPatientName: [''],
    newPatientSurname: [''],
    newPatientDateOfBirth: [''],
    newPatientGender: ['' as PatientGender | ''],
    newPatientHomeAddress: [''],
    newPatientAllergies: [''],
    newPatientDiseases: [''],
    newPatientProfession: [''],
    newPatientPhone: [''],
    selectedDate: [new Date()],
    duration: ['30', Validators.required],
    time: ['', Validators.required],
    doctorId: ['', Validators.required],
    reason: [''],
    notes: [''],
    status: ['SCHEDULED' as AppointmentStatus],
  });

  patientOptions: SelectOption[] = [];
  doctorOptions: SelectOption[] = [];
  get statusOptions(): SelectOption[] {
    return [
      { label: this.languageService.translate('Scheduled'), value: 'SCHEDULED' },
      { label: this.languageService.translate('In progress'), value: 'IN_PROGRESS' },
      { label: this.languageService.translate('Completed'), value: 'COMPLETED' },
      { label: this.languageService.translate('Cancelled'), value: 'CANCELLED' },
      { label: this.languageService.translate('No-show'), value: 'NO_SHOW' },
    ];
  }

  get genderOptions(): SelectOption[] {
    return [
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
    ];
  }

  setNewPatientGender(value: string): void {
    if (value === 'MALE' || value === 'FEMALE') {
      this.form.controls.newPatientGender.setValue(value);
    }
  }

  durationOptions: SelectOption[] = Array.from({ length: 8 }, (_, i) => {
    const minutes = (i + 1) * 15;
    return { label: `${minutes} min`, value: String(minutes) };
  });

  timeOptions: SelectOption[] = Array.from({ length: 36 }, (_, i) => {
    const total = 9 * 60 + i * 15;
    const hh = String(Math.floor(total / 60)).padStart(2, '0');
    const mm = String(total % 60).padStart(2, '0');

    return { label: `${hh}:${mm}`, value: `${hh}:${mm}` };
  });

  constructor() {
    effect(() => {
      const data = this.data();
      if (data) this.applyAppointmentData(data);
    });
  }

  get isEditing(): boolean {
    return this.appointmentId !== null;
  }

  changeStatus(value: string): void {
    switch (value) {
      case 'SCHEDULED':
      case 'IN_PROGRESS':
      case 'COMPLETED':
      case 'CANCELLED':
      case 'NO_SHOW':
        this.form.controls.status.setValue(value);
    }
  }

  ngOnInit(): void {
    this.patientService
      .getPatients()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (patients) => {
          this.patientOptions = patients.map((patient) => ({
            label: this.patientOptionLabel(patient),
            value: patient.patientId,
          }));

          const data = this.data();

          this.patientOptions = this.withOption(
            this.patientOptions,
            data?.patientId,
            data?.patientName,
          );
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to load patients for appointment form:', error);
          this.errorMessage.set(
            this.httpErrorService.message(error, 'Could not load patients.'),
          );
        },
      });

    this.branchStore.loadBranches();

    this.selectedBranch$
      .pipe(
        filter((branch) => branch !== null),
        switchMap((branch) =>
          this.userService.getDoctors(branch.branchId).pipe(
            catchError((error) => {
              console.error(error);
              this.errorMessage.set(
                this.httpErrorService.message(error, 'Could not load doctors. Please try again.'),
              );
              return EMPTY;
            }),
          ),
        ),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((doctors) => {
        this.doctorOptions = doctors.map((doctor) => ({
          label: `Dr. ${doctor.name} ${doctor.surname}`,
          value: doctor.doctorId,
        }));

        const data = this.data();
        this.doctorOptions = this.withOption(
          this.doctorOptions,
          data?.doctorId,
          data?.doctorName,
        );
        this.cdr.markForCheck();
      });
  }

  private applyAppointmentData(data: AppointmentFormData): void {
    this.appointmentId = data.id ?? null;

    this.form.patchValue({
      selectedDate: data.date,
      patientId: data.patientId ?? '',
      doctorId: data.doctorId ?? '',
      time: data.time,
      duration: data.duration,
      reason: data.reason ?? '',
      notes: data.notes ?? '',
      status: data.status ?? 'SCHEDULED',
    });

    this.timeOptions = this.withOption(this.timeOptions, data.time, data.time);

    this.durationOptions = this.withOption(
      this.durationOptions,
      data.duration,
      `${data.duration} min`,
    );
    this.cdr.markForCheck();
  }

  onPatientRegistrationChange(event: Event): void {
    const input = event.target;

    if (!(input instanceof HTMLInputElement)) return;

    const isNotRegistered = input.checked;

    this.form.controls.isPatientNotRegistered.setValue(isNotRegistered);

    const newPatientControls = [
      this.form.controls.newPatientName,
      this.form.controls.newPatientSurname,
      this.form.controls.newPatientDateOfBirth,
      this.form.controls.newPatientGender,
      this.form.controls.newPatientHomeAddress,
      this.form.controls.newPatientPhone,
    ];

    if (isNotRegistered) {
      this.form.controls.patientId.clearValidators();
    } else {
      this.form.controls.patientId.setValidators(Validators.required);
    }
    this.form.controls.patientId.updateValueAndValidity();

    for (const control of newPatientControls) {
      if (isNotRegistered) {
        control.setValidators(Validators.required);
      } else {
        control.clearValidators();
      }

      control.updateValueAndValidity();
    }
  }

  onNewPatientDateOfBirthChange(date: Date): void {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    this.form.controls.newPatientDateOfBirth.setValue(`${year}-${month}-${day}`);
  }

  onNewPatientFieldChange(
    field: 'newPatientName' | 'newPatientSurname' | 'newPatientPhone',
    event: Event,
  ): void {
    const input = event.target;

    if (input instanceof HTMLInputElement) {
      this.form.controls[field].setValue(input.value);
    }
  }

  onTextFieldChange(field: 'reason' | 'notes', event: Event): void {
    const input = event.target;

    if (input instanceof HTMLInputElement) {
      this.form.controls[field].setValue(input.value);
    }
  }

  private withOption(
    options: SelectOption[],
    value: string | undefined,
    label: string | undefined,
  ): SelectOption[] {
    if (!value || options.some((option) => option.value === value)) {
      return options;
    }

    return [...options, { label: label || value, value }];
  }

  closeForm(): void {
    if (this.isSubmitting()) return;

    this.close.emit();
  }

  submitForm(): void {
    if (this.isSubmitting()) return;

    this.validationError = '';
    this.errorMessage.set('');
    this.form.markAllAsTouched();

    if (this.form.invalid) {
      this.validationError = 'Complete all required fields.';
      return;
    }

    const formValue = this.form.getRawValue();
    const appointmentDate = new Date(formValue.selectedDate);
    const [hours, minutes] = formValue.time.split(':').map(Number);
    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
      this.validationError = 'Select a valid appointment time.';
      return;
    }
    appointmentDate.setHours(hours, minutes, 0, 0);

    const durationMinutes = Number(formValue.duration);
    if (
      Number.isNaN(appointmentDate.getTime()) ||
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0
    ) {
      this.validationError = 'Select a valid appointment date and duration.';
      return;
    }

    let newPatient: CreatePatientRequest | undefined;
    if (formValue.isPatientNotRegistered) {
      const today = new Date();
      const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const dateOfBirth = formValue.newPatientDateOfBirth;
      if (dateOfBirth > todayString) {
        this.validationError = 'Date of birth cannot be in the future.';
        return;
      }

      const name = formValue.newPatientName.trim();
      const surname = formValue.newPatientSurname.trim();
      const phone = formValue.newPatientPhone.trim();
      const homeAddress = formValue.newPatientHomeAddress.trim();
      const gender = formValue.newPatientGender;
      if (!name || !surname || !phone || !homeAddress || !gender) {
        this.validationError = 'Complete all required patient fields.';
        return;
      }

      newPatient = {
        name,
        surname,
        dateOfBirth,
        gender: gender as PatientGender,
        homeAddress,
        allergies: formValue.newPatientAllergies.trim(),
        diseases: formValue.newPatientDiseases.trim(),
        profession: formValue.newPatientProfession.trim(),
        phone,
      };
    }

    const branch = this.branchStore.selectedBranch();
    if (!this.isEditing && !branch) {
      this.errorMessage.set('Select a branch before creating an appointment.');
      return;
    }

    const patientId$ = newPatient
      ? this.patientService.createPatient(newPatient).pipe(
          tap((patient) => this.useCreatedPatient(patient)),
          map((patient) => patient.patientId),
        )
      : of(formValue.patientId);

    let saveAppointment: (patientId: string) => Observable<AppointmentResponse>;
    if (this.appointmentId) {
      const appointmentId = this.appointmentId;
      saveAppointment = (patientId) =>
        this.appointmentService.updateAppointment(appointmentId, {
          patientId,
          userId: formValue.doctorId,
          appointmentDate: appointmentDate.toISOString(),
          durationMinutes,
          description: formValue.reason.trim(),
          notes: formValue.notes.trim(),
          status: formValue.status,
        });
    } else if (branch) {
      saveAppointment = (patientId) => {
        const request: CreateAppointmentRequest = {
          branchId: branch.branchId,
          patientId,
          userId: formValue.doctorId,
          appointmentDate: appointmentDate.toISOString(),
          durationMinutes,
          description: formValue.reason.trim(),
          notes: formValue.notes.trim(),
        };
        return this.appointmentService.createAppointment(request);
      };
    } else {
      this.errorMessage.set('Select a branch before creating an appointment.');
      return;
    }

    this.isSubmitting.set(true);
    patientId$
      .pipe(
        switchMap(saveAppointment),
        finalize(() => this.isSubmitting.set(false)),
      )
      .subscribe({
        next: (appointment) => {
          this.saved.emit(appointment);
          this.close.emit();
        },
        error: (error) => {
          console.error('Failed to save appointment:', error);
          this.errorMessage.set(
            this.httpErrorService.message(
              error,
              'Could not save appointment. Check the details and try again.',
            ),
          );
        },
      });
  }

  private useCreatedPatient(patient: PatientResponse): void {
    this.patientOptions = this.withOption(
      this.patientOptions,
      patient.patientId,
      this.patientOptionLabel(patient),
    );
    this.form.controls.isPatientNotRegistered.setValue(false);
    this.form.controls.patientId.setValidators(Validators.required);
    this.form.controls.patientId.setValue(patient.patientId);
    this.form.controls.patientId.updateValueAndValidity();
    this.form.controls.newPatientName.clearValidators();
    this.form.controls.newPatientSurname.clearValidators();
    this.form.controls.newPatientDateOfBirth.clearValidators();
    this.form.controls.newPatientGender.clearValidators();
    this.form.controls.newPatientHomeAddress.clearValidators();
    this.form.controls.newPatientPhone.clearValidators();
    this.form.controls.newPatientName.updateValueAndValidity();
    this.form.controls.newPatientSurname.updateValueAndValidity();
    this.form.controls.newPatientDateOfBirth.updateValueAndValidity();
    this.form.controls.newPatientGender.updateValueAndValidity();
    this.form.controls.newPatientHomeAddress.updateValueAndValidity();
    this.form.controls.newPatientPhone.updateValueAndValidity();
    this.patientCreated.emit(patient);
  }

  private patientOptionLabel(patient: PatientResponse): string {
    return `${patient.name} ${patient.surname} | ${patient.phone}`;
  }

  deleteAppointment(): void {
    const appointmentId = this.appointmentId;

    if (!appointmentId || this.isDeleting) return;

    this.isDeleteConfirmOpen = true;
  }

  confirmDeleteAppointment(): void {
    const appointmentId = this.appointmentId;
    if (!appointmentId || this.isDeleting) return;

    this.isDeleteConfirmOpen = false;
    this.isDeleting = true;
    this.deleteError = '';

    this.appointmentService
      .deleteAppointment(appointmentId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.delete.emit(appointmentId),
        error: (error) => {
          console.error('Failed to delete appointment:', error);
          this.deleteError = this.httpErrorService.message(
            error,
            'Could not delete the appointment. Please try again.',
          );
          this.isDeleting = false;
        },
      });
  }

  cancelDeleteAppointment(): void {
    if (!this.isDeleting) this.isDeleteConfirmOpen = false;
  }
}
