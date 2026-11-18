import { Component, OnInit, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { Branch } from '../../core/models/Branch';
import { BranchService } from '../../core/services/branch-service';
import { Button } from '../../components/custom-inputs/button/button';
import { Container } from '../../components/container/container';
import { PageHeader } from '../../components/page-header/page-header';
import { BranchForm } from './components/branch-form/branch-form';
import { ConfirmationDialog } from '../../components/confirmation-dialog/confirmation-dialog';
import { LucideBuildingComplex, LucidePencil, LucidePlus, LucideTrash } from '@lucide/angular';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';
import { BranchStore } from '../../core/stores/branch-store';

@Component({
  selector: 'app-branch-management',
  imports: [
    PageHeader,
    Button,
    Container,
    BranchForm,
    ConfirmationDialog,
    LucideBuildingComplex,
    LucidePencil,
    LucidePlus,
    LucideTrash,
    TranslatePipe,
  ],
  templateUrl: './branch-management.html',
})
export class BranchManagement implements OnInit {
  private readonly branchService = inject(BranchService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly branchStore = inject(BranchStore);

  readonly branches = signal<Branch[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');
  readonly isOpen = signal(false);
  readonly selectedBranch = signal<Branch | null>(null);
  readonly deletingBranchId = signal<string | null>(null);
  readonly branchToDelete = signal<Branch | null>(null);

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.branchService
      .getAllBranches()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (branches) => this.branches.set(branches),
        error: (error) => {
          console.error(error);
          this.errorMessage.set(
            this.httpErrorService.message(error, 'Could not load branches. Please try again.'),
          );
        },
      });
  }

  openCreateForm(): void {
    this.selectedBranch.set(null);
    this.isOpen.set(true);
  }

  openEditForm(branch: Branch): void {
    this.selectedBranch.set(branch);
    this.isOpen.set(true);
  }

  closeForm(): void {
    this.isOpen.set(false);
    this.selectedBranch.set(null);
  }

  onBranchSaved(): void {
    this.closeForm();
    this.loadBranches();
    this.branchStore.refreshBranches();
  }

  deleteBranch(branch: Branch): void {
    if (this.deletingBranchId()) return;
    this.branchToDelete.set(branch);
  }

  confirmDeleteBranch(): void {
    const branch = this.branchToDelete();
    if (!branch || this.deletingBranchId()) return;

    this.branchToDelete.set(null);
    this.deletingBranchId.set(branch.branchId);
    this.errorMessage.set('');
    this.branchService
      .deleteBranch(branch.branchId)
      .pipe(finalize(() => this.deletingBranchId.set(null)))
      .subscribe({
        next: () => {
          this.branches.update((branches) =>
            branches.filter((item) => item.branchId !== branch.branchId),
          );
          this.branchStore.refreshBranches();
        },
        error: (error) => {
          console.error(error);
          this.errorMessage.set(
            this.httpErrorService.message(
              error,
              'Could not delete the branch. It may still be assigned to users.',
            ),
          );
        },
      });
  }
}
