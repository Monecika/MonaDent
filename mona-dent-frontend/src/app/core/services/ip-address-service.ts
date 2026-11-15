import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import {
  CreateIpAddressRequest,
  IpAddress,
  UpdateIpAddressRequest,
} from '../models/IpAddress';

@Injectable({
  providedIn: 'root',
})
export class IpAddressService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'ip-addresses';

  getAll(): Observable<IpAddress[]> {
    return this.api.get<IpAddress[]>(this.endpoint);
  }

  create(request: CreateIpAddressRequest): Observable<IpAddress> {
    return this.api.post<IpAddress, CreateIpAddressRequest>(this.endpoint, request);
  }

  updateName(id: string, request: UpdateIpAddressRequest): Observable<IpAddress> {
    return this.api.put<IpAddress, UpdateIpAddressRequest>(`${this.endpoint}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${id}`);
  }
}
