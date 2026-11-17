import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BaseForm } from '../../../../components/base-form/base-form';
import { CustomCalendar } from '../../../../components/custom-inputs/custom-calendar/custom-calendar';
import {
  CustomSelectInput,
  SelectOption,
} from '../../../../components/custom-inputs/custom-select-input/custom-select-input';
import {
  CreatePatientRequest,
  PatientGender,
  PatientResponse,
  UpdatePatientRequest,
} from '../../../../core/models/Patient';
import { PatientService } from '../../../../core/services/patient-service';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../../../core/services/http-error-service';

@Component({
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule, BaseForm, CustomCalendar, CustomSelectInput, TranslatePipe],
  templateUrl: './patient-form.html',
  styleUrl: './patient-form.css',
})
export class PatientForm {
  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpErrorService = inject(HttpErrorService);

  readonly patient = input<PatientResponse | null>(null);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  close = output<void>();
  created = output<PatientResponse>();
  updated = output<PatientResponse>();

  readonly today = this.toLocalDateString(new Date());
  readonly currentYear = new Date().getFullYear();

  get genderOptions(): SelectOption[] {
    return [
      { value: 'MALE', label: 'Male' },
      { value: 'FEMALE', label: 'Female' },
    ];
  }

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    surname: ['', [Validators.required, Validators.maxLength(100)]],
    dateOfBirth: ['', Validators.required],
    gender: ['' as PatientGender | '', Validators.required],
    homeAddress: ['', [Validators.required, Validators.maxLength(255)]],
    allergies: [''],
    diseases: [''],
    profession: ['', Validators.maxLength(150)],
    phone: ['', [Validators.required, Validators.maxLength(30)]],
  });

  validationError = '';

  constructor() {
    effect(() => {
      const patient = this.patient();
      if (!patient) return;

      this.form.patchValue({
        name: patient.name,
        surname: patient.surname,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender ?? '',
        homeAddress: patient.homeAddress ?? '',
        allergies: patient.allergies ?? '',
        diseases: patient.diseases ?? '',
        profession: patient.profession ?? '',
        phone: patient.phone,
      });
    });
  }

  get isEditing(): boolean {
    return this.patient() !== null;
  }

  selectedDateForCalendar(): Date {
    const dateOfBirth = this.form.controls.dateOfBirth.value;

    return dateOfBirth ? new Date(`${dateOfBirth}T12:00:00`) : new Date();
  }

  onDateOfBirthSelected(date: Date): void {
    this.form.controls.dateOfBirth.setValue(this.toLocalDateString(date));
  }

  clearDateOfBirth(): void {
    this.form.controls.dateOfBirth.setValue('');
  }

  setGender(value: string): void {
    if (value === 'MALE' || value === 'FEMALE') {
      this.form.controls.gender.setValue(value);
    }
  }

  submitForm(): void {
    if (this.isSubmitting()) return;

    this.validationError = '';
    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.validationError = 'Complete all required fields.';
      return;
    }

    const formValue = this.form.getRawValue();

    const request: CreatePatientRequest = {
      name: formValue.name.trim(),
      surname: formValue.surname.trim(),
      dateOfBirth: formValue.dateOfBirth,
      gender: formValue.gender as PatientGender,
      homeAddress: formValue.homeAddress.trim(),
      allergies: formValue.allergies.trim(),
      diseases: formValue.diseases.trim(),
      profession: formValue.profession.trim(),
      phone: formValue.phone.trim(),
    };

    if (!request.name || !request.surname || !request.homeAddress || !request.phone || !request.gender) {
      this.validationError = 'Complete all required fields.';
      return;
    }

    if (request.dateOfBirth > this.today) {
      this.validationError = 'Date of birth cannot be in the future.';
      return;
    }

    this.isSubmitting.set(true);
    const patient = this.patient();
    const saveRequest = patient
      ? this.patientService.updatePatient(patient.patientId, {
          name: request.name,
          surname: request.surname,
          dateOfBirth: request.dateOfBirth,
          gender: request.gender,
          homeAddress: request.homeAddress,
          allergies: request.allergies ?? '',
          diseases: request.diseases ?? '',
          profession: request.profession ?? '',
          phone: request.phone,
        } satisfies UpdatePatientRequest)
      : this.patientService.createPatient(request);

    saveRequest
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (savedPatient) => {
          if (patient) {
            this.updated.emit(savedPatient);
          } else {
            this.created.emit(savedPatient);
          }
          this.close.emit();
        },
        error: (error) => {
          console.error(`Failed to ${patient ? 'update' : 'create'} patient:`, error);
          this.errorMessage.set(
            this.httpErrorService.message(
              error,
              `Could not ${patient ? 'update' : 'create'} patient. Check the details and try again.`,
            ),
          );
        },
      });
  }

  closeForm(): void {
    if (this.isSubmitting()) return;

    this.close.emit();
  }

  private toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
