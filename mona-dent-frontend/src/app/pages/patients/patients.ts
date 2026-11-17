import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { auditTime, catchError, finalize, forkJoin, of } from 'rxjs';
import { PageHeader } from '../../components/page-header/page-header';
import { Container } from '../../components/container/container';
import { Searchbar } from '../../components/custom-inputs/searchbar/searchbar';
import { Button } from '../../components/custom-inputs/button/button';
import { LucidePencil, LucideDownload, LucidePlus, LucideUpload } from '@lucide/angular';
import { PatientForm } from './components/patient-form/patient-form';
import { PatientService } from '../../core/services/patient-service';
import { PatientResponse } from '../../core/models/Patient';
import { AppointmentResponse } from '../../core/models/Appointment';
import { AppointmentService } from '../../core/services/appointment-service';
import { VisitResponse } from '../../core/models/Visit';
import { VisitService } from '../../core/services/visit-service';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { LocalizedDatePipe } from '../../core/pipes/localized-date-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';
import { PatientDataExportEntry, PatientDataExportService } from '../../core/services/patient-data-export-service';
import { PatientDataImportService } from '../../core/services/patient-data-import-service';
import { PatientDataImportResult } from '../../core/services/patient-data-import-service';
import { PatientLiveUpdatesService } from '../../core/services/patient-live-updates-service';

interface PatientSummary {
  lastVisit: VisitResponse | null;
  nextAppointment: AppointmentResponse | null;
  isLoading: boolean;
  lastVisitError: string;
  nextAppointmentError: string;
}

@Component({
  selector: 'app-patients',
  imports: [
    LocalizedDatePipe,
    PageHeader,
    Container,
    Searchbar,
    Button,
    LucideDownload,
    LucideUpload,
    LucidePlus,
    LucidePencil,
    PatientForm,
    RouterLink,
    TranslatePipe,
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.css',
})
export class Patients implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private appointmentService = inject(AppointmentService);
  private visitService = inject(VisitService);
  private destroyRef = inject(DestroyRef);
  private readonly patientLiveUpdates = inject(PatientLiveUpdatesService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly patientDataExportService = inject(PatientDataExportService);
  private readonly patientDataImportService = inject(PatientDataImportService);

  isLoading = signal(true);
  loadError = signal('');
  patients = signal<PatientResponse[]>([]);
  patientSummaries = signal<Record<string, PatientSummary>>({});
  selectedPatientIds = signal<Set<string>>(new Set());
  isExporting = signal(false);
  exportError = signal('');
  importError = signal('');
  importResult = signal<PatientDataImportResult | null>(null);
  isImporting = signal(false);
  searchTerm = signal('');

  filteredPatients = computed(() => {
    const query = this.searchTerm().trim().toLowerCase();

    if (!query) {
      return this.patients();
    }

    return this.patients().filter((patient) => {
      const fullName = `${patient.name} ${patient.surname}`.toLowerCase();
      const phone = (patient.phone ?? '').toLowerCase();

      return fullName.includes(query) || phone.includes(query);
    });
  });

  isPatientOpen = false;
  readonly patientBeingEdited = signal<PatientResponse | null>(null);

  ngOnInit(): void {
    this.loadPatients();
    this.patientLiveUpdates.changes$
      .pipe(auditTime(150), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadPatients());
  }

  private loadPatients(): void {
    this.patientService
      .getPatients()
      .pipe(takeUntilDestroyed(this.destroyRef), finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (patients: PatientResponse[]) => {
          this.loadError.set('');
          this.patients.set(patients);
          this.patientSummaries.set({});
          patients.forEach((patient) => this.loadPatientSummary(patient));
        },
        error: (error) => {
          console.error(error);
          this.loadError.set(this.httpErrorService.message(error, 'Could not load patients.'));
        },
      });
  }

  async searchPatients(input: string): Promise<void> {
    this.searchTerm.set(input);

    await this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        search: input.trim() || null,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  getInitials(patient: PatientResponse): string {
    return `${patient.name.charAt(0)}${patient.surname.charAt(0)}`.toUpperCase();
  }

  closePatientPopup(): void {
    this.isPatientOpen = false;
  }

  openPatientPopup(): void {
    this.patientBeingEdited.set(null);
    this.isPatientOpen = true;
  }

  openEditPatient(patient: PatientResponse): void {
    this.patientBeingEdited.set(patient);
    this.isPatientOpen = true;
  }

  onPatientCreated(patient: PatientResponse): void {
    this.patients.update((patients) => [patient, ...patients]);
    this.loadPatientSummary(patient);
  }

  onPatientUpdated(patient: PatientResponse): void {
    this.patients.update((patients) =>
      patients.map((item) => (item.patientId === patient.patientId ? patient : item)),
    );
  }

  summaryForPatient(patientId: string): PatientSummary | null {
    return this.patientSummaries()[patientId] ?? null;
  }

  isPatientSelected(patientId: string): boolean {
    return this.selectedPatientIds().has(patientId);
  }

  allFilteredPatientsSelected(): boolean {
    const visiblePatients = this.filteredPatients();
    return visiblePatients.length > 0 && visiblePatients.every((patient) =>
      this.selectedPatientIds().has(patient.patientId),
    );
  }

  togglePatientSelection(patientId: string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.selectedPatientIds.update((current) => {
      const updated = new Set(current);
      if (checked) updated.add(patientId);
      else updated.delete(patientId);
      return updated;
    });
  }

  toggleAllFilteredPatients(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const visibleIds = this.filteredPatients().map((patient) => patient.patientId);
    this.selectedPatientIds.update((current) => {
      const updated = new Set(current);
      for (const patientId of visibleIds) {
        if (checked) updated.add(patientId);
        else updated.delete(patientId);
      }
      return updated;
    });
  }

  exportAllPatients(): void {
    this.exportPatients(this.patients(), 'mona-dent-all-patients');
  }

  exportSelectedPatients(): void {
    const selectedIds = this.selectedPatientIds();
    const selectedPatients = this.patients().filter((patient) => selectedIds.has(patient.patientId));
    this.exportPatients(selectedPatients, 'mona-dent-selected-patients');
  }

  exportPatient(patient: PatientResponse): void {
    this.exportPatients([patient], `mona-dent-${this.fileSafeName(patient.name)}-${this.fileSafeName(patient.surname)}`);
  }

  async importPatients(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file || this.isImporting()) return;

    this.importError.set('');
    this.importResult.set(null);
    let entries: PatientDataExportEntry[];
    try {
      const data: unknown = JSON.parse(await file.text());
      entries = this.parseImport(data);
      if (!entries.length) throw new Error('The selected file contains no patients.');
    } catch (error) {
      this.importError.set(error instanceof Error ? error.message : 'Could not read the selected file.');
      return;
    }

    this.isImporting.set(true);
    try {
      const result = await this.patientDataImportService.import(entries);
      this.importResult.set(result);
      if (result.failures.length) this.importError.set(result.failures.join(' '));
      this.loadPatients();
    } catch (error) {
      this.importError.set(error instanceof Error ? error.message : 'Could not import the selected file.');
    } finally {
      this.isImporting.set(false);
    }
  }

  private parseImport(value: unknown): PatientDataExportEntry[] {
    if (!value || typeof value !== 'object') throw new Error('Invalid Mona Dent export file.');
    const data = value as { format?: unknown; version?: unknown; patients?: unknown };
    if (data.format !== 'mona-dent-patient-data' || data.version !== 1 || !Array.isArray(data.patients)) {
      throw new Error('Choose a Mona Dent patient export file (JSON, version 1).');
    }

    return data.patients.map((entry: unknown, index: number) => {
      const bundle = entry as (Partial<PatientDataExportEntry> & { patient?: Record<string, unknown> }) | null;
      const patient = bundle?.patient;
      if (!patient || typeof patient !== 'object' ||
          typeof patient['name'] !== 'string' || !patient['name'].trim() ||
          typeof patient['surname'] !== 'string' || !patient['surname'].trim() ||
          typeof patient['dateOfBirth'] !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(patient['dateOfBirth']) ||
          typeof patient['phone'] !== 'string' ||
          !Array.isArray(bundle?.appointments) || !Array.isArray(bundle?.visits) ||
          !Array.isArray(bundle?.teeth) || !Array.isArray(bundle?.toothHistory) ||
          !Array.isArray(bundle?.files)) {
        throw new Error(`Patient entry ${index + 1} has invalid or missing profile data.`);
      }
      return bundle as PatientDataExportEntry;
    });
  }

  private exportPatients(patients: PatientResponse[], filenamePrefix: string): void {
    if (!patients.length || this.isExporting()) return;
    this.exportError.set('');
    this.isExporting.set(true);
    this.patientDataExportService.createExport(patients).pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.isExporting.set(false)),
    ).subscribe({
      next: (data) => {
        const date = new Date().toISOString().slice(0, 10);
        this.patientDataExportService.download(data, `${filenamePrefix}-${date}.json`);
      },
      error: (error) => {
        this.exportError.set(this.httpErrorService.message(error, 'Could not export patient data.'));
      },
    });
  }

  private fileSafeName(value: string): string {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'patient';
  }

  private loadPatientSummary(patient: PatientResponse): void {
    this.patientSummaries.update((summaries) => ({
      ...summaries,
      [patient.patientId]: {
        lastVisit: null,
        nextAppointment: null,
        isLoading: true,
        lastVisitError: '',
        nextAppointmentError: '',
      },
    }));

    let lastVisitError = '';
    let nextAppointmentError = '';

    forkJoin({
      lastVisit: this.visitService.getLastPatientVisit(patient.patientId).pipe(
        catchError((error) => {
          console.error(`Failed to load last visit for patient ${patient.patientId}:`, error);
          lastVisitError = this.httpErrorService.message(error, 'Could not load previous visit.');
          return of(null);
        }),
      ),
      nextAppointment: this.appointmentService.getNextPatientAppointment(patient.patientId).pipe(
        catchError((error) => {
          console.error(`Failed to load next appointment for patient ${patient.patientId}:`, error);
          nextAppointmentError = this.httpErrorService.message(
            error,
            'Could not load next appointment.',
          );
          return of(null);
        }),
      ),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ lastVisit, nextAppointment }) => {
        this.patientSummaries.update((summaries) => ({
          ...summaries,
          [patient.patientId]: {
            lastVisit,
            nextAppointment,
            isLoading: false,
            lastVisitError,
            nextAppointmentError,
          },
        }));
      });
  }
}
