import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateVisitRequest, VisitResponse } from '../models/Visit';
import { ApiClient } from './api-client';

@Injectable({
  providedIn: 'root',
})
export class VisitService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'visits';

  getPatientVisits(patientId: string): Observable<VisitResponse[]> {
    return this.api.get<VisitResponse[]>(`${this.endpoint}/patient/${patientId}`);
  }

  getLastPatientVisit(patientId: string): Observable<VisitResponse | null> {
    return this.api.get<VisitResponse | null>(`${this.endpoint}/patient/${patientId}/last`);
  }

  createVisit(request: CreateVisitRequest): Observable<VisitResponse> {
    return this.api.post<VisitResponse, CreateVisitRequest>(`${this.endpoint}`, request);
  }
}
