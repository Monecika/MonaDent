import { inject, Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LanguageService } from './language-service';

interface ApiErrorResponse {
  errorType?: unknown;
  message?: unknown;
  detail?: unknown;
  errors?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class HttpErrorService {
  private readonly languageService = inject(LanguageService);

  message(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      const body = error.error as ApiErrorResponse | null;
      if (body && typeof body === 'object') {
        if (typeof body.message === 'string' && body.message.trim()) return body.message;
        if (typeof body.detail === 'string' && body.detail.trim()) return body.detail;
        if (typeof body.errorType === 'string' && body.errorType.trim()) return body.errorType;
        if (Array.isArray(body.errors)) {
          const messages = body.errors.filter(
            (item): item is string => typeof item === 'string' && item.trim().length > 0,
          );
          if (messages.length) return messages.join(', ');
        }
      }

      if (error.status === 0) {
        return this.languageService.translate('Unable to connect to the server. Please try again.');
      }
      if (error.status === 409) {
        return this.languageService.translate('A value you entered is already in use.');
      }
    }

    return this.languageService.translate(fallback);
  }
}
