import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';

import { Button } from '../../components/custom-inputs/button/button';
import { Loader } from '../../components/loader/loader';
import { AuthService } from '../../core/services/auth-service';
import { AuthResponse } from '../../core/models/User';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Button, Loader, TranslatePipe],
  templateUrl: './login.html',
})
export class LoginComponent {
  private static readonly INITIAL_ADMIN_EMAIL = 'admin@default.com';
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);
  private readonly httpErrorService = inject(HttpErrorService);

  readonly isLoading = signal(false);
  readonly emailChanged = this.route.snapshot.queryParamMap.get('reason') === 'email-changed';
  error = '';

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  signIn(): void {
    if (this.isLoading()) return;

    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    const { email, password } = this.form.getRawValue();

    this.authService
      .login({ email, password })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (auth: AuthResponse) => {
          localStorage.setItem('userAccessToken', auth.accessToken);
          const isInitialAdmin =
            auth.email.trim().toLowerCase() === LoginComponent.INITIAL_ADMIN_EMAIL;
          const showCredentialReminder = auth.mustChangePassword || isInitialAdmin;
          void this.router.navigate(showCredentialReminder ? ['/account'] : ['/'], {
            queryParams: showCredentialReminder ? { initialCredentials: true } : undefined,
          });
        },
        error: (error) => {
          console.error(error);
          this.error = this.httpErrorService.message(error, 'Invalid email or password.');
        },
      });
  }
}
