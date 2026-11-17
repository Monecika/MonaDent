import {
  Component,
  ChangeDetectorRef,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  signal,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LucideCheck,
  LucideChevronLeft,
  LucideChevronRight,
  LucideChevronsLeft,
  LucideChevronsRight,
  LucideStethoscope,
  LucideX,
} from '@lucide/angular';
import { catchError, finalize, of } from 'rxjs';
import {
  CreatePatientToothRequest,
  PatientToothHistoryResponse,
  PatientToothResponse,
  MobilityGrade,
  ToothFinding,
  ToothType,
  UpdatePatientToothRequest,
} from '../../../../core/models/PatientTooth';
import { PatientToothService } from '../../../../core/services/patient-tooth-service';
import {
  CustomSelectInput,
  SelectOption,
} from '../../../../components/custom-inputs/custom-select-input/custom-select-input';
import { Container } from '../../../../components/container/container';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { LocalizedDatePipe } from '../../../../core/pipes/localized-date-pipe';
import { LanguageService } from '../../../../core/services/language-service';
import { HttpErrorService } from '../../../../core/services/http-error-service';

type ToothArch = 'upper' | 'lower';

interface Tooth {
  number: number;
  arch: ToothArch;
  type: 'PRIMARY' | 'PERMANENT';
  kind: 'molar' | 'premolar' | 'canine' | 'incisor';
}

interface ToothRecord {
  toothId: string;
  number: number;
  arch: ToothArch;
  type: 'PRIMARY' | 'PERMANENT';
  kind: Tooth['kind'];
  findings: ToothFinding[];
  mobilityGrade: MobilityGrade | null;
  notes: string;
}

interface ToothOption {
  number: number;
  type: ToothType;
  replacesToothNumber: number | null;
}

@Component({
  selector: 'app-overview',
  imports: [
    Container,
    CustomSelectInput,
    LocalizedDatePipe,
    LucideCheck,
    LucideChevronLeft,
    LucideChevronRight,
    LucideChevronsLeft,
    LucideChevronsRight,
    LucideStethoscope,
    LucideX,
    TranslatePipe,
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview {
  readonly patientId = input.required<string>();
  readonly initialTeeth = input.required<PatientToothResponse[]>();
  readonly initialToothHistory = input.required<PatientToothHistoryResponse[]>();
  readonly initialToothError = input('');
  readonly initialToothHistoryError = input('');

  private readonly patientToothService = inject(PatientToothService);
  private readonly languageService = inject(LanguageService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  private loadedPatientId: string | null = null;
  private loadedTeeth: PatientToothResponse[] | null = null;
  private loadedToothHistory: PatientToothHistoryResponse[] | null = null;
  private chartInitializedForPatient = false;

  readonly toothHistory = signal<PatientToothHistoryResponse[]>([]);
  readonly toothHistoryPage = signal(0);
  readonly toothHistoryPageSize = 10;
  readonly toothHistoryFilter = signal<number | null>(null);
  readonly filteredToothHistory = computed(() => {
    const selected = this.toothHistoryFilter();
    return [...this.toothHistory()]
      .filter((event) => selected === null || event.toothNumber === selected || event.previousToothNumber === selected)
      .sort((a, b) => (b.changedAt ?? '').localeCompare(a.changedAt ?? ''));
  });
  readonly toothHistoryPageCount = computed(() =>
    Math.max(1, Math.ceil(this.filteredToothHistory().length / this.toothHistoryPageSize)),
  );
  readonly visibleToothHistory = computed(() => {
    const start = this.toothHistoryPage() * this.toothHistoryPageSize;
    return this.filteredToothHistory().slice(start, start + this.toothHistoryPageSize);
  });
  readonly toothHistoryError = signal('');
  readonly toothError = signal('');

  constructor() {
    effect(() => {
      const patientId = this.patientId();
      const teeth = this.initialTeeth();
      const history = this.initialToothHistory();
      const isNewPatient = patientId !== this.loadedPatientId;
      const teethChanged = teeth !== this.loadedTeeth;
      const historyChanged = history !== this.loadedToothHistory;
      if (isNewPatient) this.chartInitializedForPatient = false;
      const initializeChart = isNewPatient || (!this.chartInitializedForPatient && teeth.length > 0);

      if (!isNewPatient && !teethChanged && !historyChanged) return;

      const hasUnsavedToothChanges = !this.toothChangesUnchanged();
      if (isNewPatient || teethChanged) {
        this.toothRecords.set(
          Object.fromEntries(teeth.map((tooth) => [tooth.toothNumber, this.toothRecord(tooth)])),
        );
      }
      if (isNewPatient || historyChanged) {
        this.toothHistory.set(history);
      }
      this.toothError.set(this.initialToothError());
      this.toothHistoryError.set(this.initialToothHistoryError());

      if (initializeChart) {
        this.toothHistoryPage.set(0);
        this.toothHistoryFilter.set(null);
        const firstTooth = untracked(
          () => this.teethInArch('upper')[0] ?? this.teethInArch('lower')[0] ?? null,
        );
        this.selectedToothNumber.set(firstTooth?.number ?? 0);
        this.toothNotesDraft.set(
          firstTooth?.number
            ? (teeth.find((tooth) => tooth.toothNumber === firstTooth.number)?.notes ?? '')
            : '',
        );
        this.toothFindingsDraft.set(null);
        this.toothMobilityDraft.set(null);
        this.toothSaveMessage.set('');
        this.chartInitializedForPatient = teeth.length > 0;
      } else if (teethChanged && hasUnsavedToothChanges) {
        this.toothSaveMessage.set('The chart changed in another session. Your unsaved changes were kept.');
      }

      this.loadedPatientId = patientId;
      this.loadedTeeth = teeth;
      this.loadedToothHistory = history;
    });
  }

  readonly selectedToothNumber = signal(0);
  readonly toothRecords = signal<Record<number, ToothRecord>>({});
  readonly isLoadingToothHistory = signal(false);
  readonly newToothType = signal<ToothType>('PERMANENT');
  readonly newToothNumber = signal<number | null>(null);
  readonly isAddingTooth = signal(false);
  readonly addToothError = signal('');
  readonly addToothMessage = signal('');
  readonly findingGroups: { title: string; findings: ToothFinding[] }[] = [
    { title: 'Conditions', findings: ['CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM'] },
    { title: 'Treatments and restorations', findings: ['FILLING', 'CROWN', 'IMPLANT'] },
  ];
  readonly findingOrder: ToothFinding[] = [
    'NOT_ASSESSED', 'HEALTHY', 'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE',
    'ROOT_PROBLEM', 'FILLING', 'CROWN', 'IMPLANT', 'MISSING',
  ];
  readonly assessmentStatusOptions = computed<SelectOption[]>(() => {
    this.languageService.language();
    return [
      { value: 'NOT_ASSESSED', label: this.languageService.translate('Not assessed') },
      { value: 'HEALTHY', label: this.languageService.translate('Healthy') },
      { value: 'MISSING', label: this.languageService.translate('Missing') },
    ];
  });
  readonly mobilityOptions = computed<SelectOption[]>(() => {
    this.languageService.language();
    return [
      { value: '', label: this.languageService.translate('No mobility') },
      { value: '1', label: this.languageService.translate('Mobility — grade I') },
      { value: '2', label: this.languageService.translate('Mobility — grade II') },
      { value: '3', label: this.languageService.translate('Mobility — grade III') },
    ];
  });
  readonly toothTypeSelectOptions = computed<SelectOption[]>(() => {
    this.languageService.language();
    return [
      { value: 'PERMANENT', label: this.languageService.translate('Permanent') },
      { value: 'PRIMARY', label: this.languageService.translate('Temporary') },
    ];
  });
  readonly upperTeeth = computed(() => this.teethInArch('upper'));
  readonly lowerTeeth = computed(() => this.teethInArch('lower'));
  readonly availableToothOptions = computed(() => this.toothOptions(this.newToothType()));
  readonly availableToothSelectOptions = computed<SelectOption[]>(() =>
    this.availableToothOptions().map((option) => {
      this.languageService.language();
      return {
        value: String(option.number),
        label: `${this.languageService.translate('Tooth')} ${option.number}${
          option.replacesToothNumber
            ? ` (${this.languageService.translate('replaces')} ${option.replacesToothNumber})`
            : ''
        }`,
      };
    }),
  );
  readonly selectedTooth = computed(() => this.toothRecords()[this.selectedToothNumber()] ?? null);
  readonly selectedToothRecord = computed(
    () => this.toothRecords()[this.selectedToothNumber()] ?? null,
  );
  readonly toothNotesDraft = signal('');
  readonly toothFindingsDraft = signal<ToothFinding[] | null>(null);
  readonly toothMobilityDraft = signal<MobilityGrade | 0 | null>(null);
  readonly isSavingTooth = signal(false);
  readonly toothSaveMessage = signal('');
  selectTooth(tooth: Tooth): void {
    this.selectedToothNumber.set(tooth.number);
    this.toothHistoryFilter.set(tooth.number);
    this.toothHistoryPage.set(0);
    this.toothNotesDraft.set(this.toothRecords()[tooth.number]?.notes ?? '');
    this.toothFindingsDraft.set(null);
    this.toothMobilityDraft.set(null);
    this.toothSaveMessage.set('');
  }

  showAllToothHistory(): void {
    this.toothHistoryFilter.set(null);
    this.toothHistoryPage.set(0);
  }

  changeNewToothType(value: string): void {
    if (value !== 'PRIMARY' && value !== 'PERMANENT') return;

    this.newToothType.set(value);
    this.newToothNumber.set(null);
    this.addToothError.set('');
  }

  changeNewToothNumber(value: string): void {
    this.newToothNumber.set(value ? Number(value) : null);
    this.addToothError.set('');
  }

  addTooth(): void {
    const patientId = this.patientId();
    const option = this.availableToothOptions().find(
      (tooth) => tooth.number === this.newToothNumber(),
    );
    if (!patientId || !option || this.isAddingTooth()) return;

    const request: CreatePatientToothRequest = {
      toothNumber: option.number,
      toothType: option.type,
      findings: ['NOT_ASSESSED'],
    };

    this.isAddingTooth.set(true);
    this.addToothError.set('');
    this.addToothMessage.set('');
    this.patientToothService
      .addPatientTooth(patientId, request)
      .pipe(finalize(() => this.isAddingTooth.set(false)))
      .subscribe({
        next: (addedTooth) => {
          this.toothRecords.update((records) => {
            const updatedRecords = Object.fromEntries(
              Object.entries(records).filter(
                ([, tooth]) => !this.samePosition(tooth.number, addedTooth.toothNumber),
              ),
            );
            return {
              ...updatedRecords,
              [addedTooth.toothNumber]: this.toothRecord(addedTooth),
            };
          });
          this.selectedToothNumber.set(addedTooth.toothNumber);
          this.toothHistoryFilter.set(addedTooth.toothNumber);
          this.toothHistoryPage.set(0);
          this.toothNotesDraft.set(addedTooth.notes ?? '');
          this.toothFindingsDraft.set(null);
          this.toothMobilityDraft.set(null);
          this.newToothNumber.set(null);
          this.refreshToothHistory(patientId);
          this.addToothMessage.set(
            option.replacesToothNumber
              ? `Tooth ${option.replacesToothNumber} was replaced by tooth ${addedTooth.toothNumber}.`
              : `Tooth ${addedTooth.toothNumber} was added.`,
          );
        },
        error: (error) => {
          console.error('Failed to add patient tooth:', error);
          this.addToothError.set(
            this.httpErrorService.message(error, 'Could not add the tooth. Please try again.'),
          );
        },
      });
  }

  toggleFinding(finding: ToothFinding, checked: boolean): void {
    const record = this.selectedToothRecord();
    if (!record) return;
    let findings = [...(this.toothFindingsDraft() ?? record.findings)];
    if (checked) {
      if (finding === 'IMPLANT') {
        findings = findings.filter((item) => item === 'HEALTHY');
      } else if (finding === 'CROWN') {
        findings = findings.filter((item) => item !== 'IMPLANT' && item !== 'NOT_ASSESSED' && item !== 'MISSING');
      } else if (['CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM'].includes(finding)) {
        findings = findings.filter((item) => !['HEALTHY', 'NOT_ASSESSED', 'MISSING', 'IMPLANT'].includes(item));
      } else if (finding === 'FILLING') {
        findings = findings.filter((item) => !['NOT_ASSESSED', 'MISSING', 'IMPLANT'].includes(item));
      }
      if (!findings.includes(finding)) findings.push(finding);
    } else {
      findings = findings.filter((item) => item !== finding);
      if (!findings.length) findings = ['NOT_ASSESSED'];
    }
    findings.sort((a, b) => this.findingOrder.indexOf(a) - this.findingOrder.indexOf(b));
    this.toothFindingsDraft.set(findings);
    this.toothSaveMessage.set('');
  }

  assessmentStatusValue(): string {
    const findings = this.selectedToothRecord()?.findings ?? [];
    const draft = this.toothFindingsDraft();
    const current = draft ?? findings;
    if (current.includes('MISSING')) return 'MISSING';
    if (current.includes('HEALTHY')) return 'HEALTHY';
    if (current.includes('NOT_ASSESSED')) return 'NOT_ASSESSED';
    return '';
  }

  changeAssessmentStatus(value: string): void {
    if (value !== 'NOT_ASSESSED' && value !== 'HEALTHY' && value !== 'MISSING') return;
    const record = this.selectedToothRecord();
    if (!record) return;
    let findings = [...(this.toothFindingsDraft() ?? record.findings)];
    if (value === 'NOT_ASSESSED' || value === 'MISSING') {
      findings = [value];
      this.toothMobilityDraft.set(0);
    } else {
      findings = findings.filter((item) => ![
        'NOT_ASSESSED', 'MISSING', 'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM',
      ].includes(item));
      if (!findings.includes('HEALTHY')) findings.push('HEALTHY');
    }
    findings.sort((a, b) => this.findingOrder.indexOf(a) - this.findingOrder.indexOf(b));
    this.toothFindingsDraft.set(findings);
    this.toothSaveMessage.set('');
  }

  isFindingSelected(finding: ToothFinding): boolean {
    const record = this.selectedToothRecord();
    return (this.toothFindingsDraft() ?? record?.findings ?? []).includes(finding);
  }

  changeMobilityGrade(value: string): void {
    if (value !== '' && value !== '1' && value !== '2' && value !== '3') return;
    this.toothMobilityDraft.set(value ? Number(value) as MobilityGrade : 0);
    this.toothSaveMessage.set('');
  }

  selectedMobilityGradeValue(): string {
    const record = this.selectedToothRecord();
    const draft = this.toothMobilityDraft();
    const grade = draft === null ? record?.mobilityGrade ?? null : draft;
    return grade ? String(grade) : '';
  }

  findingLabel(finding: ToothFinding): string {
    const labels: Record<ToothFinding, string> = {
      NOT_ASSESSED: 'Not assessed', HEALTHY: 'Healthy', CARIES: 'Caries', PULPITIS: 'Pulpitis',
      PERIODONTITIS: 'Periodontitis', PERIODONTAL_DISEASE: 'Periodontal disease', ROOT_PROBLEM: 'Root problem',
      FILLING: 'Filling', CROWN: 'Crown', IMPLANT: 'Implant', MISSING: 'Missing',
    };
    return labels[finding];
  }

  toothCaptionLabel(tooth: Tooth): string {
    const findings = this.findingsFor(tooth);
    if (findings.includes('MISSING')) return 'Missing';
    if (findings.includes('IMPLANT')) return 'Implant';
    if (findings.includes('NOT_ASSESSED')) return 'Not assessed';
    if (findings.includes('HEALTHY')) return 'Healthy';
    if (findings.some((finding) => ['CROWN', 'FILLING'].includes(finding))) return 'Healthy';
    return this.findingLabel(findings[0]);
  }

  findingSummary(tooth: Tooth): string {
    const findings = this.findingsFor(tooth);
    const labels = findings.map((finding) => this.languageService.translate(this.findingLabel(finding)));
    const mobility = this.mobilityLabel(tooth);
    if (mobility) labels.push(this.languageService.translate(mobility));
    return labels.join(', ');
  }

  hasFinding(tooth: Tooth, ...findings: ToothFinding[]): boolean {
    const current = this.findingsFor(tooth);
    return findings.some((finding) => current.includes(finding));
  }

  mobilityLabel(tooth: Tooth): string {
    const grade = this.mobilityGradeFor(tooth);
    return grade ? `Mobility — grade ${['', 'I', 'II', 'III'][grade]}` : '';
  }

  mobilityBadge(tooth: Tooth): string {
    const grade = this.mobilityGradeFor(tooth);
    return grade ? ['', 'I', 'II', 'III'][grade] : '';
  }

  mobilityHistoryLabel(grade: number | null | undefined): string {
    const gradeName = grade ? ['I', 'II', 'III'][grade - 1] : null;
    return this.languageService.translate(gradeName ? `Mobility — grade ${gradeName}` : 'No mobility');
  }

  isNotAssessed(tooth: Tooth): boolean {
    const findings = this.findingsFor(tooth);
    return findings.includes('NOT_ASSESSED');
  }

  private findingsFor(tooth: Tooth): ToothFinding[] {
    const stored = this.toothRecords()[tooth.number]?.findings ?? ['NOT_ASSESSED'];
    return this.selectedToothNumber() === tooth.number ? this.toothFindingsDraft() ?? stored : stored;
  }

  private mobilityGradeFor(tooth: Tooth): MobilityGrade | null {
    const stored = this.toothRecords()[tooth.number]?.mobilityGrade ?? null;
    if (this.selectedToothNumber() !== tooth.number || this.toothMobilityDraft() === null) return stored;
    return this.toothMobilityDraft() || null;
  }

  isProblem(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE', 'ROOT_PROBLEM');
  }

  updateToothNotes(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLTextAreaElement) {
      this.toothNotesDraft.set(target.value);
      this.toothSaveMessage.set('');
    }
  }

  saveToothChanges(): void {
    const current = this.selectedToothRecord();
    if (!current) return;
    this.saveTooth({
      findings: this.toothFindingsDraft() ?? current.findings,
      mobilityGrade: this.toothMobilityDraft() === null
        ? current.mobilityGrade ?? null
        : this.toothMobilityDraft() || null,
      notes: this.toothNotesDraft(),
    });
  }

  toothNotesUnchanged(): boolean {
    return this.toothNotesDraft() === (this.selectedToothRecord()?.notes ?? '');
  }

  toothChangesUnchanged(): boolean {
    const current = this.selectedToothRecord();
    return (
      !!current &&
      this.toothNotesUnchanged() &&
      JSON.stringify(this.toothFindingsDraft() ?? current.findings) === JSON.stringify(current.findings) &&
      (this.toothMobilityDraft() === null ? current.mobilityGrade ?? null : this.toothMobilityDraft() || null) ===
        (current.mobilityGrade ?? null)
    );
  }

  hasAbsentTooth(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'MISSING');
  }

  toothCrownFill(tooth: Tooth): string {
    if (this.hasFinding(tooth, 'CROWN')) return '#e0f2fe';
    if (this.isNotAssessed(tooth)) return '#f8f6ee';
    if (this.hasFinding(tooth, 'CARIES')) return 'var(--color-error)';
    return 'var(--color-success)';
  }

  toothRootFill(tooth: Tooth): string {
    if (this.hasFinding(tooth, 'ROOT_PROBLEM', 'PERIODONTITIS')) return 'var(--color-error)';
    if (this.isNotAssessed(tooth)) return '#f8f6ee';
    return 'var(--color-success)';
  }

  hasRootProblem(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'ROOT_PROBLEM');
  }

  hasGumDisease(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'PERIODONTAL_DISEASE');
  }

  hasCaries(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'CARIES');
  }

  hasPulpitis(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'PULPITIS');
  }

  hasPeriodontitis(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'PERIODONTITIS');
  }

  hasFilling(tooth: Tooth): boolean {
    return this.hasFinding(tooth, 'FILLING');
  }

  private toothRecord(tooth: PatientToothResponse): ToothRecord {
    const number = tooth.toothNumber;
    const quadrant = Math.floor(number / 10);
    const type = tooth.toothType;

    return {
      toothId: tooth.toothId,
      number,
      arch: [1, 2, 5, 6].includes(quadrant) ? 'upper' : 'lower',
      type,
      kind: this.toothKind(number % 10, type),
      findings: tooth.findings ?? ['NOT_ASSESSED'],
      mobilityGrade: tooth.mobilityGrade ?? null,
      notes: tooth.notes ?? '',
    };
  }

  private saveTooth(request: UpdatePatientToothRequest): void {
    const patientId = this.patientId();
    const current = this.selectedToothRecord();
    if (this.isSavingTooth()) return;
    if (!patientId || !current) {
      this.toothError.set('This tooth is not available for editing.');
      return;
    }

    this.isSavingTooth.set(true);
    this.toothError.set('');
    this.toothSaveMessage.set('');
    this.patientToothService
      .updatePatientTooth(patientId, current.toothId, request)
      .pipe(
        finalize(() => this.isSavingTooth.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (updatedTooth) => {
          this.toothRecords.update((records) => ({
            ...records,
            [updatedTooth.toothNumber]: this.toothRecord(updatedTooth),
          }));
          this.toothFindingsDraft.set(null);
          this.toothMobilityDraft.set(null);
          this.toothNotesDraft.set(updatedTooth.notes ?? '');
          this.toothSaveMessage.set(`Changes saved for tooth ${updatedTooth.toothNumber}`);
          this.changeDetector.detectChanges();
          this.refreshToothHistory(patientId);
        },
        error: (error) => {
          console.error('Failed to save patient tooth:', error);
          this.toothError.set(
            this.httpErrorService.message(error, 'Could not save changes. Please try again.'),
          );
          this.changeDetector.detectChanges();
        },
      });
  }

  historyEventLabel(eventType: string): string {
    const labels: Record<string, string> = {
      TOOTH_ADDED: 'Tooth added',
      TOOTH_REPLACED: 'Tooth replaced',
      TOOTH_UPDATED: 'Tooth updated',
    };
    return labels[eventType] ?? 'Tooth change';
  }

  historyEventDescription(event: PatientToothHistoryResponse): string {
    const format = (template: string, values: Record<string, string>) =>
      Object.entries(values).reduce(
        (message, [key, value]) => message.replaceAll(`{${key}}`, value),
        this.languageService.translate(template),
      );
    const type = this.languageService.translate(this.historyToothTypeLabel(event.toothType));

    if (event.eventType === 'TOOTH_ADDED') {
      return format('Tooth {number} ({type}) was added.', {
        number: String(event.toothNumber),
        type,
      });
    }
    if (event.eventType === 'TOOTH_REPLACED') {
      return format('Tooth {previous} ({previousType}) was replaced by tooth {current} ({currentType}).', {
        previous: String(event.previousToothNumber ?? event.toothNumber),
        previousType: this.languageService.translate(this.historyToothTypeLabel(event.previousToothType)),
        current: String(event.toothNumber),
        currentType: type,
      });
    }

    const changes: string[] = [];
    if (JSON.stringify(event.oldFindings) !== JSON.stringify(event.newFindings)) {
      changes.push(format('Findings changed from {old} to {new}.', {
        old: event.oldFindings.map((finding) => this.languageService.translate(this.historyValueLabel(finding))).join(', '),
        new: event.newFindings.map((finding) => this.languageService.translate(this.historyValueLabel(finding))).join(', '),
      }));
    }
    if (event.oldMobilityGrade !== event.newMobilityGrade) {
      changes.push(format('Mobility changed from {old} to {new}.', {
        old: this.mobilityHistoryLabel(event.oldMobilityGrade),
        new: this.mobilityHistoryLabel(event.newMobilityGrade),
      }));
    }
    if (changes.length) return changes.join(' ');
    if (/notes updated/i.test(event.description ?? '')) {
      return this.languageService.translate('Notes updated.');
    }
    return this.languageService.translate('Tooth record updated.');
  }

  historyEventDescriptionHtml(event: PatientToothHistoryResponse): string {
    const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[character]!);
    const boldChange = (template: string, oldValue: string, newValue: string) =>
      this.languageService.translate(template)
        .replace('{old}', `<strong>${escapeHtml(oldValue)}</strong>`)
        .replace('{new}', `<strong>${escapeHtml(newValue)}</strong>`);
    const changes: string[] = [];

    if (JSON.stringify(event.oldFindings) !== JSON.stringify(event.newFindings)) {
      changes.push(boldChange(
        'Findings changed from {old} to {new}.',
        event.oldFindings.map((finding) => this.languageService.translate(this.historyValueLabel(finding))).join(', '),
        event.newFindings.map((finding) => this.languageService.translate(this.historyValueLabel(finding))).join(', '),
      ));
    }
    if (event.oldMobilityGrade !== event.newMobilityGrade) {
      changes.push(boldChange(
        'Mobility changed from {old} to {new}.',
        this.mobilityHistoryLabel(event.oldMobilityGrade),
        this.mobilityHistoryLabel(event.newMobilityGrade),
      ));
    }

    return changes.length ? changes.join('<br>') : escapeHtml(this.historyEventDescription(event));
  }

  historyValueLabel(value: string | null | undefined): string {
    if (!value) return '—';
    const labels: Record<string, string> = {
      NOT_ASSESSED: 'Not assessed', HEALTHY: 'Healthy', CARIES: 'Caries', PULPITIS: 'Pulpitis',
      PERIODONTITIS: 'Periodontitis', PERIODONTAL_DISEASE: 'Periodontal disease', ROOT_PROBLEM: 'Root problem',
      FILLING: 'Filling', CROWN: 'Crown', IMPLANT: 'Implant', MISSING: 'Missing',
    };
    if (labels[value]) return labels[value];
    return value
      .toLowerCase()
      .replaceAll('_', ' ')
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  historyToothTypeLabel(type: ToothType | null | undefined): string {
    if (!type) return 'Previous dentition';
    return type === 'PRIMARY' ? 'Temporary' : 'Permanent';
  }

  previousToothHistoryPage(): void {
    this.toothHistoryPage.update((page) => Math.max(0, page - 1));
  }

  firstToothHistoryPage(): void {
    this.toothHistoryPage.set(0);
  }

  nextToothHistoryPage(): void {
    this.toothHistoryPage.update((page) =>
      Math.min(this.toothHistoryPageCount() - 1, page + 1),
    );
  }

  lastToothHistoryPage(): void {
    this.toothHistoryPage.set(this.toothHistoryPageCount() - 1);
  }

  private refreshToothHistory(patientId: string): void {
    this.isLoadingToothHistory.set(true);
    this.toothHistoryError.set('');
    this.patientToothService
      .getPatientToothHistory(patientId)
      .pipe(
        catchError((error) => {
          console.error('Failed to refresh patient tooth history:', error);
          this.toothHistoryError.set(
            this.httpErrorService.message(error, 'Could not refresh tooth history.'),
          );
          return of(null);
        }),
        finalize(() => this.isLoadingToothHistory.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((history) => {
        if (history) {
          this.toothHistory.set(history);
          this.toothHistoryPage.set(0);
        }
      });
  }

  isMidline(tooth: Tooth, previousTooth?: Tooth): boolean {
    if (!previousTooth) return false;
    return this.isRightSide(tooth) !== this.isRightSide(previousTooth);
  }

  private teethInArch(arch: ToothArch): Tooth[] {
    return Object.values(this.toothRecords())
      .filter((tooth) => tooth.arch === arch)
      .sort((a, b) => {
        const sideDifference = Number(this.isRightSide(a)) - Number(this.isRightSide(b));
        if (sideDifference !== 0) return -sideDifference;

        const positionDifference = (a.number % 10) - (b.number % 10);
        const sameOrdering = this.isRightSide(a) ? -positionDifference : positionDifference;
        if (sameOrdering !== 0) return sameOrdering;

        return a.type.localeCompare(b.type);
      });
  }

  private isRightSide(tooth: Tooth): boolean {
    const quadrant = Math.floor(tooth.number / 10);
    return tooth.arch === 'upper'
      ? quadrant === 1 || quadrant === 5
      : quadrant === 4 || quadrant === 8;
  }

  private toothKind(position: number, type: ToothRecord['type']): Tooth['kind'] {
    if (position <= 2) return 'incisor';
    if (position === 3) return 'canine';
    if (type === 'PERMANENT' && position <= 5) return 'premolar';
    return 'molar';
  }

  private toothOptions(type: ToothType): ToothOption[] {
    const records = Object.values(this.toothRecords());
    const quadrants = type === 'PERMANENT' ? [1, 2, 3, 4] : [5, 6, 7, 8];
    const lastPosition = type === 'PERMANENT' ? 8 : 5;

    return quadrants.flatMap((quadrant) =>
      Array.from({ length: lastPosition }, (_, index) => {
        const number = quadrant * 10 + index + 1;
        const existing = records.find((tooth) => tooth.number === number);
        if (existing) return null;

        const replacement = records.find((tooth) => this.samePosition(tooth.number, number));
        return {
          number,
          type,
          replacesToothNumber: replacement?.number ?? null,
        };
      }).filter((option): option is ToothOption => option !== null),
    );
  }

  private samePosition(firstNumber: number, secondNumber: number): boolean {
    const firstQuadrant = Math.floor(firstNumber / 10);
    const secondQuadrant = Math.floor(secondNumber / 10);
    const firstPermanentQuadrant = firstQuadrant >= 5 ? firstQuadrant - 4 : firstQuadrant;
    const secondPermanentQuadrant = secondQuadrant >= 5 ? secondQuadrant - 4 : secondQuadrant;

    return (
      firstPermanentQuadrant === secondPermanentQuadrant && firstNumber % 10 === secondNumber % 10
    );
  }
}
