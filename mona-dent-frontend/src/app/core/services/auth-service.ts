import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import { AuthRequest, AuthResponse, UpdatePasswordRequest } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'auth';

  login(authRequest: AuthRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse, AuthRequest>(`${this.endpoint}/login`, authRequest);
  }

  updatePassword(request: UpdatePasswordRequest): Observable<void> {
    return this.api.put<void, UpdatePasswordRequest>(`${this.endpoint}/me/password`, request);
  }
}
