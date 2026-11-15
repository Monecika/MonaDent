import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { Branch } from '../../../../core/models/Branch';
import { UserRequest, UserResponse, UserRole, UserStatus } from '../../../../core/models/User';
import { BranchService } from '../../../../core/services/branch-service';
import { UserService } from '../../../../core/services/user-service';

import {
  CustomSelectInput,
  SelectOption,
} from '../../../../components/custom-inputs/custom-select-input/custom-select-input';
import { CustomCalendar } from '../../../../components/custom-inputs/custom-calendar/custom-calendar';
import { BaseForm } from '../../../../components/base-form/base-form';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { LanguageService } from '../../../../core/services/language-service';
import { HttpErrorService } from '../../../../core/services/http-error-service';

const USER_ROLES: UserRole[] = ['ADMIN', 'MANAGER', 'DOCTOR', 'ASSISTANT', 'RECEPTIONIST'];
const USER_STATUSES: UserStatus[] = ['ACTIVE', 'INACTIVE'];

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CustomSelectInput, CustomCalendar, BaseForm, TranslatePipe],
  templateUrl: './user-form.html',
  styleUrl: './user-form.css',
})
export class UserForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly branchService = inject(BranchService);
  private readonly userService = inject(UserService);
  private readonly languageService = inject(LanguageService);
  private readonly httpErrorService = inject(HttpErrorService);

  user = input<UserResponse | null>(null);
  close = output<void>();
  saved = output<void>();

  get roleOptions(): SelectOption[] {
    return USER_ROLES.map((role) => ({
      label: this.languageService.translate(
        role === 'ADMIN' ? 'Administrator' : role[0] + role.slice(1).toLowerCase(),
      ),
      value: role,
    }));
  }

  get statusOptions(): SelectOption[] {
    return USER_STATUSES.map((status) => ({
      label: this.languageService.translate(status === 'ACTIVE' ? 'Active' : 'Inactive'),
      value: status,
    }));
  }

  readonly branches = signal<Branch[]>([]);
  readonly errorMessage = signal('');
  isSubmitting = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    dateOfBirth: [''],
    role: ['', Validators.required],
    status: this.fb.nonNullable.control<UserStatus>('ACTIVE'),
    password: ['', Validators.required],
    branchIds: this.fb.nonNullable.control<string[]>([]),
  });

  get isEditing(): boolean {
    return this.user() !== null;
  }

  ngOnInit(): void {
    const user = this.user();

    if (user) {
      this.form.patchValue({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        role: user.role,
        status: user.status,
        branchIds: [...user.branchIds],
      });

      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
    }

    this.branchService.getAllBranches().subscribe({
      next: (branches) => {
        this.branches.set(branches);
      },
      error: (error) => {
        console.error(error);
        this.errorMessage.set(this.httpErrorService.message(
          error,
          'Could not load branches. Please try again.',
        ));
      },
    });
  }

  toggleBranch(branchId: string, checked: boolean): void {
    const branchIds = this.form.controls.branchIds.value;

    this.form.controls.branchIds.setValue(
      checked ? [...new Set([...branchIds, branchId])] : branchIds.filter((id) => id !== branchId),
    );
  }

  onBranchChange(branchId: string, event: Event): void {
    const target = event.target;

    if (target instanceof HTMLInputElement) {
      this.toggleBranch(branchId, target.checked);
    }
  }

  onStatusChange(status: string): void {
    if (status === 'ACTIVE' || status === 'INACTIVE') {
      this.form.controls.status.setValue(status);
    }
  }

  onDateOfBirthChange(date: Date): void {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    this.form.controls.dateOfBirth.setValue(`${year}-${month}-${day}`);
  }

  submitForm(): void {
    if (this.isSubmitting) return;

    this.errorMessage.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMessage.set('Complete all required fields.');
      return;
    }

    const formValue = this.form.getRawValue();
    const user = this.user();

    const request: UserRequest = {
      branchIds: formValue.branchIds,
      name: formValue.name.trim(),
      surname: formValue.surname.trim(),
      email: formValue.email.trim(),
      phone: formValue.phone.trim(),
      dateOfBirth: formValue.dateOfBirth,
      role: formValue.role as UserRole,
      status: formValue.status,
      ...(user?.calendarColor ? { calendarColor: user.calendarColor } : {}),
    };

    this.isSubmitting = true;

    const saveRequest = user
      ? this.userService.updateUser(user.userId, request)
      : this.userService.createUser({
          ...request,
          password: formValue.password,
        });

    saveRequest.pipe(finalize(() => (this.isSubmitting = false))).subscribe({
      next: () => this.saved.emit(),
      error: (error) => {
        console.error(error);
        this.errorMessage.set(this.httpErrorService.message(
          error,
          'Could not save user. Please check the details and try again.',
        ));
      },
    });
  }

  closeForm(): void {
    this.close.emit();
  }
}
