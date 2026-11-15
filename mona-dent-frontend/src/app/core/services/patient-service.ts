import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import { CreatePatientRequest, PatientResponse, UpdatePatientRequest } from '../models/Patient';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'patients';

  getPatients(): Observable<PatientResponse[]> {
    return this.api.get<PatientResponse[]>(this.endpoint);
  }

  createPatient(request: CreatePatientRequest): Observable<PatientResponse> {
    return this.api.post<PatientResponse, CreatePatientRequest>(this.endpoint, request);
  }

  updatePatient(patientId: string, request: UpdatePatientRequest): Observable<PatientResponse> {
    return this.api.put<PatientResponse, UpdatePatientRequest>(`${this.endpoint}/${patientId}`, request);
  }
}
