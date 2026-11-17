import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { Button } from '../../components/custom-inputs/button/button';
import { Container } from '../../components/container/container';
import { PageHeader } from '../../components/page-header/page-header';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { OrganizationService } from '../../core/services/organization-service';
import { HttpErrorService } from '../../core/services/http-error-service';

@Component({
  selector: 'app-organization-management',
  imports: [ReactiveFormsModule, Button, Container, PageHeader, TranslatePipe],
  templateUrl: './organization-management.html',
})
export class OrganizationManagement implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly organizationService = inject(OrganizationService);
  private readonly httpErrorService = inject(HttpErrorService);

  readonly isLoading = signal(true);
  readonly isSaving = signal(false);
  readonly errorMessage = signal('');
  readonly successMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(200), Validators.pattern(/\S/)]],
    idno: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/\S/)]],
  });

  ngOnInit(): void {
    this.organizationService.getOrganization()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (organization) => this.form.patchValue(organization),
        error: (error) => {
          this.errorMessage.set(this.httpErrorService.message(error, 'Could not load organization details.'));
        },
      });
  }

  save(): void {
    this.form.markAllAsTouched();
    this.errorMessage.set('');
    this.successMessage.set('');
    if (this.isSaving()) return;
    if (this.form.invalid) {
      this.errorMessage.set('Complete all required fields.');
      return;
    }

    const request = {
      name: this.form.controls.name.value.trim(),
      idno: this.form.controls.idno.value.trim(),
    };
    if (!request.name || !request.idno) {
      if (!request.name) this.form.controls.name.setErrors({ required: true });
      if (!request.idno) this.form.controls.idno.setErrors({ required: true });
      this.errorMessage.set('Complete all required fields.');
      return;
    }

    this.isSaving.set(true);
    this.organizationService.updateOrganization(request)
      .pipe(finalize(() => this.isSaving.set(false)))
      .subscribe({
        next: (organization) => {
          this.form.patchValue(organization);
          this.successMessage.set('Organization details saved.');
        },
        error: (error) => {
          this.errorMessage.set(this.httpErrorService.message(error, 'Could not save organization details.'));
        },
      });
  }
}
