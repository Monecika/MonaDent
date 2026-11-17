import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import { OrganizationSettings, UpdateOrganizationRequest } from '../models/Organization';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'organization';

  getOrganization(): Observable<OrganizationSettings> {
    return this.api.get<OrganizationSettings>(this.endpoint);
  }

  updateOrganization(request: UpdateOrganizationRequest): Observable<OrganizationSettings> {
    return this.api.put<OrganizationSettings, UpdateOrganizationRequest>(this.endpoint, request);
  }
}
