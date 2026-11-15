import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreatePatientToothRequest,
  PatientToothHistoryResponse,
  PatientToothResponse,
  UpdatePatientToothRequest,
} from '../models/PatientTooth';
import { ApiClient } from './api-client';

@Injectable({
  providedIn: 'root',
})
export class PatientToothService {
  private readonly api = inject(ApiClient);

  getPatientTeeth(patientId: string): Observable<PatientToothResponse[]> {
    return this.api.get<PatientToothResponse[]>(`patients/${patientId}/teeth`);
  }

  getPatientToothHistory(patientId: string): Observable<PatientToothHistoryResponse[]> {
    return this.api.get<PatientToothHistoryResponse[]>(`patients/${patientId}/teeth/history`);
  }

  addPatientTooth(
    patientId: string,
    request: CreatePatientToothRequest,
  ): Observable<PatientToothResponse> {
    return this.api.post<PatientToothResponse, CreatePatientToothRequest>(
      `patients/${patientId}/teeth`,
      request,
    );
  }

  updatePatientTooth(
    patientId: string,
    toothId: string,
    request: UpdatePatientToothRequest,
  ): Observable<PatientToothResponse> {
    return this.api.put<PatientToothResponse, UpdatePatientToothRequest>(
      `patients/${patientId}/teeth/${toothId}`,
      request,
    );
  }
}
