import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Branch } from '../models/Branch';
import { BranchService } from '../services/branch-service';
import { HttpErrorService } from '../services/http-error-service';
import { UserStore } from './user-store';

@Injectable({
  providedIn: 'root',
})
export class BranchStore {
  private readonly branchService = inject(BranchService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly userStore = inject(UserStore);
  private readonly storage = inject(DOCUMENT).defaultView?.localStorage;
  private activeUserId: string | null = null;
  private requestId = 0;

  readonly branches = signal<Branch[] | null>(null);
  readonly selectedBranch = signal<Branch | null>(null);
  readonly isLoading = signal(false);
  readonly loadError = signal('');

  loadBranches(userId = this.userStore.user()?.userId): void {
    if (!userId) {
      this.userStore.loadUser();
      return;
    }

    if (this.activeUserId === userId && (this.branches() !== null || this.isLoading())) return;

    if (this.activeUserId !== userId) {
      this.requestId++;
      this.branches.set(null);
      this.selectedBranch.set(null);
      this.isLoading.set(false);
    }

    this.activeUserId = userId;
    const requestId = ++this.requestId;

    this.isLoading.set(true);
    this.loadError.set('');
    this.branchService
      .assignedBranches()
      .pipe(finalize(() => {
        if (requestId === this.requestId) this.isLoading.set(false);
      }))
      .subscribe({
        next: (branches) => {
          if (requestId !== this.requestId) return;
          this.branches.set(branches);
          this.loadError.set('');
          const preferenceKey = this.preferenceKey(userId);
          const preferredBranchId = this.storage?.getItem(preferenceKey);
          const selected = branches.find((branch) => branch.branchId === preferredBranchId)
            ?? branches[0]
            ?? null;
          this.selectedBranch.set(selected);
          if (selected) this.storage?.setItem(preferenceKey, selected.branchId);
          else this.storage?.removeItem(preferenceKey);
        },
        error: (error) => {
          if (requestId !== this.requestId) return;
          console.error(error);
          this.loadError.set(
            this.httpErrorService.message(error, 'Could not load branches. Please try again.'),
          );
        },
      });
  }

  reset(): void {
    this.requestId++;
    this.activeUserId = null;
    this.branches.set(null);
    this.selectedBranch.set(null);
    this.isLoading.set(false);
    this.loadError.set('');
  }

  refreshBranches(): void {
    const userId = this.activeUserId ?? this.userStore.user()?.userId;
    if (!userId) return;

    this.branches.set(null);
    this.isLoading.set(false);
    this.loadBranches(userId);
  }

  selectBranch(branch: Branch): void {
    this.selectedBranch.set(branch);
    if (this.activeUserId) {
      this.storage?.setItem(this.preferenceKey(this.activeUserId), branch.branchId);
    }
  }

  private preferenceKey(userId: string): string {
    return `monaDent.selectedBranch.${userId}`;
  }
}
