import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import {
  CreateUserRequest,
  DoctorResponse,
  UpdateMeRequest,
  UserRequest,
  UserResponse,
} from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'users';

  me(): Observable<UserResponse> {
    return this.api.get<UserResponse>(`${this.endpoint}/me`);
  }

  updateMe(request: UpdateMeRequest): Observable<UserResponse> {
    return this.api.put<UserResponse, UpdateMeRequest>(`${this.endpoint}/me`, request);
  }

  updatePreferredLanguage(language: UserResponse['preferredLanguage']): Observable<UserResponse> {
    return this.updateMe({ preferredLanguage: language });
  }

  getAllUsers(): Observable<UserResponse[]> {
    return this.api.get<UserResponse[]>(this.endpoint);
  }

  getDoctors(branchId: string): Observable<DoctorResponse[]> {
    return this.api.get<DoctorResponse[]>(`${this.endpoint}/doctors`, { branchId });
  }

  createUser(user: CreateUserRequest): Observable<UserResponse> {
    return this.api.post<UserResponse, CreateUserRequest>(this.endpoint, user);
  }

  updateUser(userId: string, user: UserRequest): Observable<UserResponse> {
    return this.api.put<UserResponse, UserRequest>(`${this.endpoint}/${userId}`, user);
  }
}
