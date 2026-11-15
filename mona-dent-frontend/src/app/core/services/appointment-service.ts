import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreateAppointmentRequest,
  AppointmentResponse,
  UpdateAppointmentRequest,
} from '../models/Appointment';
import { ApiClient } from './api-client';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'appointments';

  getAppointments(branchId: string, date?: string): Observable<AppointmentResponse[]> {
    return this.api.get<AppointmentResponse[]>(this.endpoint, {
      branchId,
      ...(date ? { date } : {}),
    });
  }

  getPatientAppointments(patientId: string): Observable<AppointmentResponse[]> {
    return this.api.get<AppointmentResponse[]>(`${this.endpoint}/patient/${patientId}`);
  }

  getNextPatientAppointment(patientId: string): Observable<AppointmentResponse | null> {
    return this.api.get<AppointmentResponse | null>(`${this.endpoint}/patient/${patientId}/next`);
  }

  createAppointment(request: CreateAppointmentRequest): Observable<AppointmentResponse> {
    return this.api.post<AppointmentResponse, CreateAppointmentRequest>(this.endpoint, request);
  }

  updateAppointment(
    appointmentId: string,
    request: UpdateAppointmentRequest,
  ): Observable<AppointmentResponse> {
    return this.api.put<AppointmentResponse, UpdateAppointmentRequest>(
      `${this.endpoint}/${appointmentId}`,
      request,
    );
  }

  deleteAppointment(appointmentId: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${appointmentId}`);
  }
}
