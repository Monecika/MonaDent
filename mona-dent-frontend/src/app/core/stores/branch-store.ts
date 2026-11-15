import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Branch } from '../models/Branch';
import { BranchService } from '../services/branch-service';
import { HttpErrorService } from '../services/http-error-service';

@Injectable({
  providedIn: 'root',
})
export class BranchStore {
  private readonly branchService = inject(BranchService);
  private readonly httpErrorService = inject(HttpErrorService);

  readonly branches = signal<Branch[] | null>(null);
  readonly selectedBranch = signal<Branch | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal('');

  loadBranches(): void {
    if (this.branches() !== null || this.isLoading()) return;

    this.isLoading.set(true);
    this.loadError.set('');
    this.branchService
      .assignedBranches()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (branches) => {
          this.branches.set(branches);
          this.loadError.set('');
          if (!this.selectedBranch()) this.selectedBranch.set(branches[0] ?? null);
        },
        error: (error) => {
          console.error(error);
          this.loadError.set(
            this.httpErrorService.message(error, 'Could not load branches. Please try again.'),
          );
        },
      });
  }

  reset(): void {
    this.branches.set(null);
    this.selectedBranch.set(null);
    this.isLoading.set(false);
    this.loadError.set('');
  }

  selectBranch(branch: Branch): void {
    this.selectedBranch.set(branch);
  }
}
