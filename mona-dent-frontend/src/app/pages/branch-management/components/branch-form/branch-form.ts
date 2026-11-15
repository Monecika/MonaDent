import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Branch, CreateBranchRequest, UpdateBranchRequest } from '../../../../core/models/Branch';
import { BranchService } from '../../../../core/services/branch-service';
import { BaseForm } from '../../../../components/base-form/base-form';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../../../core/services/http-error-service';

@Component({
  selector: 'app-branch-form',
  imports: [ReactiveFormsModule, BaseForm, TranslatePipe],
  templateUrl: './branch-form.html',
})
export class BranchForm {
  private readonly branchService = inject(BranchService);
  private readonly fb = inject(FormBuilder);
  private readonly httpErrorService = inject(HttpErrorService);

  branch = input<Branch | null>(null);
  close = output<void>();
  saved = output<void>();

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: [''],
  });

  errorMessage = '';
  isSubmitting = false;

  ngOnInit(): void {
    const branch = this.branch();
    if (!branch) return;

    this.form.patchValue({
      name: branch.name,
      address: branch.address ?? '',
    });
  }

  get isEditing(): boolean {
    return this.branch() !== null;
  }

  submitForm(): void {
    if (this.isSubmitting) return;

    const { name, address } = this.form.getRawValue();
    const trimmedName = name.trim();
    const trimmedAddress = address.trim();

    if (!trimmedName && !trimmedAddress) {
      this.errorMessage = 'Enter a branch name or address.';
      return;
    }

    if (!this.isEditing && !trimmedName) {
      this.errorMessage = 'Enter a branch name to create the branch.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    const branch = this.branch();

    const request = branch
      ? this.branchService.updateBranch(branch.branchId, {
          name: trimmedName,
          address: trimmedAddress,
        } satisfies UpdateBranchRequest)
      : this.branchService.createBranch({
          name: trimmedName,
          address: trimmedAddress,
        } satisfies CreateBranchRequest);

    request.subscribe({
      next: () => this.saved.emit(),
      error: (error) => {
        console.error(error);
        this.errorMessage = this.httpErrorService.message(
          error,
          'Could not save the branch. Please check the details and try again.',
        );
        this.isSubmitting = false;
      },
    });
  }

  closeForm(): void {
    this.close.emit();
  }
}
