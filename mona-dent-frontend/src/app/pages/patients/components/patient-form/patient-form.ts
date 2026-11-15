import { Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

import { BaseForm } from '../../../../components/base-form/base-form';
import { CustomCalendar } from '../../../../components/custom-inputs/custom-calendar/custom-calendar';
import {
  CreatePatientRequest,
  PatientResponse,
  UpdatePatientRequest,
} from '../../../../core/models/Patient';
import { PatientService } from '../../../../core/services/patient-service';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../../../core/services/http-error-service';

@Component({
  selector: 'app-patient-form',
  imports: [ReactiveFormsModule, BaseForm, CustomCalendar, TranslatePipe],
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

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    surname: ['', [Validators.required, Validators.maxLength(100)]],
    dateOfBirth: ['', Validators.required],
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
      phone: formValue.phone.trim(),
    };

    if (!request.name || !request.surname || !request.phone) {
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
