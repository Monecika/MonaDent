import { Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { catchError, EMPTY, filter, finalize, switchMap } from 'rxjs';
import { BaseForm } from '../../../../components/base-form/base-form';
import { CustomCalendar } from '../../../../components/custom-inputs/custom-calendar/custom-calendar';
import {
  CustomSelectInput,
  SelectOption,
} from '../../../../components/custom-inputs/custom-select-input/custom-select-input';
import { CreateVisitRequest, VisitResponse } from '../../../../core/models/Visit';
import { UserService } from '../../../../core/services/user-service';
import { VisitService } from '../../../../core/services/visit-service';
import { BranchStore } from '../../../../core/stores/branch-store';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../../../core/services/http-error-service';

@Component({
  selector: 'app-visit-form',
  imports: [ReactiveFormsModule, BaseForm, CustomCalendar, CustomSelectInput, TranslatePipe],
  templateUrl: './visit-form.html',
})
export class VisitForm {
  readonly patientId = input.required<string>();
  readonly close = output<void>();
  readonly saved = output<VisitResponse>();

  private readonly fb = inject(FormBuilder);
  private readonly branchStore = inject(BranchStore);
  private readonly userService = inject(UserService);
  private readonly visitService = inject(VisitService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly selectedBranch$ = toObservable(this.branchStore.selectedBranch);

  readonly isSubmitting = signal(false);
  readonly errorMessage = signal('');
  readonly currentYear = new Date().getFullYear();
  validationError = '';
  doctorOptions: SelectOption[] = [];

  readonly form = this.fb.nonNullable.group({
    selectedDate: [new Date(), Validators.required],
    time: ['', Validators.required],
    duration: ['5', Validators.required],
    doctorId: ['', Validators.required],
    description: [''],
    notes: [''],
  });

  readonly durationOptions: SelectOption[] = [5, 15, 30, 45, 60, 90, 120].map((minutes) => ({
    label: `${minutes} min`,
    value: String(minutes),
  }));

  readonly timeOptions: SelectOption[] = Array.from({ length: 36 }, (_, index) => {
    const total = 9 * 60 + index * 15;
    const hours = String(Math.floor(total / 60)).padStart(2, '0');
    const minutes = String(total % 60).padStart(2, '0');
    return { label: `${hours}:${minutes}`, value: `${hours}:${minutes}` };
  });

  constructor() {
    this.branchStore.loadBranches();

    this.selectedBranch$
      .pipe(
        filter((branch) => branch !== null),
        switchMap((branch) =>
          this.userService.getDoctors(branch.branchId).pipe(
            catchError((error) => {
              console.error('Failed to load doctors for visit form:', error);
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
      });
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

    const branch = this.branchStore.selectedBranch();
    if (!branch) {
      this.errorMessage.set('Select a branch before creating a visit.');
      return;
    }

    const value = this.form.getRawValue();
    const visitDate = new Date(value.selectedDate);
    const [hours, minutes] = value.time.split(':').map(Number);
    const durationMinutes = Number(value.duration);

    if (
      Number.isNaN(visitDate.getTime()) ||
      !Number.isFinite(hours) ||
      !Number.isFinite(minutes) ||
      !Number.isFinite(durationMinutes) ||
      durationMinutes <= 0
    ) {
      this.validationError = 'Select a valid visit date, time, and duration.';
      return;
    }

    visitDate.setHours(hours, minutes, 0, 0);

    const request: CreateVisitRequest = {
      branchId: branch.branchId,
      patientId: this.patientId(),
      doctorId: value.doctorId,
      appointmentId: null,
      visitDate: visitDate.toISOString(),
      durationMinutes,
      ...(value.description.trim() ? { description: value.description.trim() } : {}),
      ...(value.notes.trim() ? { notes: value.notes.trim() } : {}),
    };

    this.isSubmitting.set(true);
    this.visitService
      .createVisit(request)
      .pipe(
        finalize(() => this.isSubmitting.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (visit) => {
          this.saved.emit(visit);
          this.close.emit();
        },
        error: (error) => {
          console.error('Failed to create visit:', error);
          this.errorMessage.set(
            this.httpErrorService.message(
              error,
              'Could not create visit. Check the details and try again.',
            ),
          );
        },
      });
  }
}
