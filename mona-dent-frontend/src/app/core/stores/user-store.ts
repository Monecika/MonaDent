import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { UserResponse } from '../models/User';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { LanguageService } from '../services/language-service';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpErrorService } from '../services/http-error-service';

@Injectable({
  providedIn: 'root',
})
export class UserStore {
  private userService = inject(UserService);
  private router = inject(Router);
  private languageService = inject(LanguageService);
  private readonly httpErrorService = inject(HttpErrorService);

  readonly user = signal<UserResponse | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal('');

  loadUser(): void {
    if (this.user() !== null || this.isLoading()) {
      return;
    }

    this.isLoading.set(true);
    this.loadError.set('');

    this.userService
      .me()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (response: UserResponse) => {
          this.user.set(response);
          this.languageService.setLanguageFromProfile(response.preferredLanguage);
          this.loadError.set('');
        },
        error: (error) => {
          console.error(error);
          this.loadError.set(this.httpErrorService.message(error, 'Could not load your profile.'));
          if (error instanceof HttpErrorResponse && error.status === 401) {
            localStorage.removeItem('userAccessToken');
            void this.router.navigate(['/login']);
          }
        },
      });
  }
}
