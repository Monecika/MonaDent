import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../models/Branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly api = inject(ApiClient);
  private readonly endpoint = 'branches';

  getAllBranches(): Observable<Branch[]> {
    return this.api.get<Branch[]>(this.endpoint);
  }

  assignedBranches(): Observable<Branch[]> {
    return this.api.get<Branch[]>(`${this.endpoint}/assigned`);
  }

  createBranch(request: CreateBranchRequest): Observable<Branch> {
    return this.api.post<Branch, CreateBranchRequest>(this.endpoint, request);
  }

  updateBranch(branchId: string, request: UpdateBranchRequest): Observable<Branch> {
    return this.api.put<Branch, UpdateBranchRequest>(`${this.endpoint}/${branchId}`, request);
  }

  deleteBranch(branchId: string): Observable<void> {
    return this.api.delete(`${this.endpoint}/${branchId}`);
  }
}
