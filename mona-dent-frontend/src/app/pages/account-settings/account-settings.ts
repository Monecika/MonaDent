import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { PageHeader } from '../../components/page-header/page-header';
import { Button } from '../../components/custom-inputs/button/button';
import { Container } from '../../components/container/container';
import { LucideShieldCheck, LucideUser } from '@lucide/angular';
import { Loader } from '../../components/loader/loader';
import { CustomCalendar } from '../../components/custom-inputs/custom-calendar/custom-calendar';
import { UserStore } from '../../core/stores/user-store';
import { UpdateMeRequest } from '../../core/models/User';
import { AuthService } from '../../core/services/auth-service';
import { UserService } from '../../core/services/user-service';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';
import { BranchStore } from '../../core/stores/branch-store';

@Component({
  selector: 'app-account-settings',
  imports: [
    ReactiveFormsModule,
    PageHeader,
    Button,
    Container,
    LucideUser,
    LucideShieldCheck,
    Loader,
    CustomCalendar,
    TranslatePipe,
  ],
  templateUrl: './account-settings.html',
  styleUrl: './account-settings.css',
})
export class AccountSettings implements OnInit {
  private readonly userStore = inject(UserStore);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly branchStore = inject(BranchStore);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly user = this.userStore.user;
  readonly isLoading = signal(false);
  readonly currentYear = new Date().getFullYear();
  private readonly initialCredentialsReminderRoute =
    this.route.snapshot.queryParamMap.get('initialCredentials') === 'true' ||
    this.route.snapshot.queryParamMap.get('initialPassword') === 'true';
  readonly showInitialCredentialsReminder = computed(() =>
    this.initialCredentialsReminderRoute ||
    this.user()?.email.trim().toLowerCase() === 'admin@default.com',
  );

  profileMessage = '';
  profileError = '';
  passwordMessage = '';
  passwordError = '';

  readonly profileForm = this.fb.nonNullable.group({
    name: ['', Validators.required],
    surname: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]+$/)]],
    dateOfBirth: [''],
    calendarColor: ['#2856d8'],
  });

  readonly authForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
  });

  constructor() {
    effect(() => {
      const user = this.user();

      if (!user) return;

      this.profileForm.patchValue({
        name: user.name,
        surname: user.surname,
        email: user.email,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth ?? '',
        calendarColor: user.calendarColor ?? '#2856d8',
      });
    });
  }

  ngOnInit(): void {
    this.userStore.loadUser();
  }

  saveProfile(): void {
    if (this.isLoading()) return;

    this.profileMessage = '';
    this.profileError = '';

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const currentUser = this.user();
    if (!currentUser) {
      this.profileError = 'User profile not found.';
      return;
    }

    const { name, surname, email, phone, dateOfBirth, calendarColor } =
      this.profileForm.getRawValue();

    const changes: UpdateMeRequest = {
      name,
      surname,
      email,
      phone,
      dateOfBirth,
      calendarColor,
    };

    this.isLoading.set(true);
    this.userService
      .updateMe(changes)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (user) => {
          const emailChanged =
            user.email.trim().toLowerCase() !== currentUser.email.trim().toLowerCase();

          if (emailChanged) {
            localStorage.removeItem('userAccessToken');
            this.userStore.user.set(null);
            this.branchStore.reset();
            void this.router.navigate(['/login'], {
              queryParams: { reason: 'email-changed' },
            });
            return;
          }

          this.userStore.user.set(user);
          this.profileMessage = 'Your account details have been updated.';
        },
        error: (error) => {
          console.error(error);
          this.profileError = this.httpErrorService.message(
            error,
            'Could not update your account details. Please try again.',
          );
        },
      });
  }

  onDateOfBirthSelected(date: Date): void {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    this.profileForm.controls.dateOfBirth.setValue(`${date.getFullYear()}-${month}-${day}`);
  }

  updateAuthData(): void {
    if (this.isLoading()) return;

    this.passwordMessage = '';
    this.passwordError = '';

    if (this.authForm.invalid) {
      this.authForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.authForm.getRawValue();

    this.isLoading.set(true);
    this.authService
      .updatePassword({ currentPassword, newPassword })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: () => {
          this.authForm.reset();
          this.passwordMessage = 'Your password has been updated.';
        },
        error: (error) => {
          console.error(error);
          this.passwordError = this.httpErrorService.message(
            error,
            'Could not update your password. Check your current password and try again.',
          );
        },
      });
  }
}
