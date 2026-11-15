import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { CalendarOptions, FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import timeGridPlugin from '@fullcalendar/angular/timegrid';
import interactionPlugin from '@fullcalendar/angular/interaction';
import themePlugin from '@fullcalendar/angular/themes/monarch';
import { LucideChevronLeft, LucideChevronRight } from '@lucide/angular';
import { catchError, EMPTY, filter, finalize, forkJoin, switchMap } from 'rxjs';
import {
  AppointmentResponse,
  AppointmentStatus,
  UpdateAppointmentRequest,
} from '../../../../core/models/Appointment';
import { Branch } from '../../../../core/models/Branch';
import { DoctorResponse } from '../../../../core/models/User';
import { AppointmentService } from '../../../../core/services/appointment-service';
import { UserService } from '../../../../core/services/user-service';
import { BranchStore } from '../../../../core/stores/branch-store';
import { Container } from '../../../../components/container/container';
import { ConfirmationDialog } from '../../../../components/confirmation-dialog/confirmation-dialog';
import { CustomCalendar } from '../../../../components/custom-inputs/custom-calendar/custom-calendar';
import { CustomSelectInput } from '../../../../components/custom-inputs/custom-select-input/custom-select-input';
import { AppointmentForm, AppointmentFormData } from '../appointment-form/appointment-form';
import { Loader } from '../../../../components/loader/loader';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { LanguageService } from '../../../../core/services/language-service';
import { HttpErrorService } from '../../../../core/services/http-error-service';
import { LanguageCode } from '../../../../core/services/language-service';
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  AfterViewInit,
  effect,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';

type EventDropArg = Parameters<NonNullable<CalendarOptions['eventDrop']>>[0];
type EventResizeArg = Parameters<NonNullable<CalendarOptions['eventResize']>>[0];

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  backgroundColor: string;
  borderColor: string;
  extendedProps: {
    employeeId: string;
    employeeName: string;
    patientId: string;
    patientName: string;
    description: string;
    notes: string;
    status: AppointmentStatus;
  };
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FullCalendarModule,
    Container,
    LucideChevronLeft,
    LucideChevronRight,
    CustomCalendar,
    CustomSelectInput,
    AppointmentForm,
    Loader,
    ConfirmationDialog,
    TranslatePipe,
  ],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class CalendarComponent implements OnInit, AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly appointmentService = inject(AppointmentService);
  private readonly userService = inject(UserService);
  readonly branchStore = inject(BranchStore);
  private readonly languageService = inject(LanguageService);
  private readonly httpErrorService = inject(HttpErrorService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly selectedBranch$ = toObservable(this.branchStore.selectedBranch);

  private calendar?: FullCalendarComponent;

  @ViewChild(FullCalendarComponent)
  set calendarComponent(component: FullCalendarComponent | undefined) {
    this.calendar = component;
    if (component) void this.updateCalendarLocale(this.languageService.language());
  }

  selectedDate = new Date();
  private weekRange: { start: Date; end: Date } | null = null;
  isFormOpen = false;
  isLoading = signal(true);
  readonly isMobileView = signal(false);
  readonly isCompactToolbar = signal(false);
  isSavingChange = false;
  changeError = signal('');
  formData: AppointmentFormData | null = null;
  private doctors: DoctorResponse[] = [];

  get doctorOptions(): { label: string; value: string; color?: string }[] {
    return [
      { label: this.languageService.translate('All doctors'), value: '' },
      ...this.doctors.map((doctor) => ({
        label: `${doctor.name} ${doctor.surname}`,
        value: doctor.doctorId,
        color: doctor.calendarColor || '#2856d8',
      })),
    ];
  }

  get weekTitle(): string {
    if (!this.weekRange) return '';
    const locale = { ro: 'ro-RO', ru: 'ru-RU', en: 'en-GB' }[this.languageService.language()];
    const { start, end } = this.weekRange;
    return `${start.toLocaleDateString(locale, { day: 'numeric', month: 'short' })} – ${end.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }
  selectedDoctor = '';
  isConfirmPopupOpen = false;
  private pendingCalendarChange: EventDropArg | EventResizeArg | null = null;
  private localeLoadId = 0;

  private allEvents: CalendarEvent[] = [];
  private doctorColors = new Map<string, string>();
  private doctorsById = new Map<string, DoctorResponse>();
  private doctorsByName = new Map<string, DoctorResponse>();

  constructor() {
    this.branchStore.loadBranches();

    effect(() => {
      const language = this.languageService.language();
      if (this.calendar) void this.updateCalendarLocale(language);
      if (!this.branchStore.isLoading() && !this.branchStore.selectedBranch()) {
        this.allEvents = [];
        this.applyFilter();
        this.isLoading.set(false);
      }
    });
  }

  calendarOptions: CalendarOptions = {
    plugins: [themePlugin, timeGridPlugin, interactionPlugin],
    locale: this.languageService.language() === 'en' ? 'en-gb' : this.languageService.language(),
    initialView: 'timeGridWeek',
    headerToolbar: false,
    firstDay: 1,
    hiddenDays: [0],
    allDaySlot: false,
    slotMinTime: '09:00:00',
    slotMaxTime: '18:00:00',
    slotDuration: '00:30:00',
    snapDuration: '00:15:00',
    height: 1000,
    expandRows: true,
    nowIndicator: true,
    selectable: true,
    editable: true,
    eventStartEditable: true,
    eventDurationEditable: true,
    eventDrop: (info) => this.requestCalendarChange(info),
    eventResize: (info) => this.requestCalendarChange(info),
    events: [],
    datesSet: (arg) => {
      const start = arg.view.currentStart;
      const end = new Date(arg.view.currentEnd);
      end.setDate(end.getDate() - 1);
      const date = new Date(arg.view.currentStart);

      queueMicrotask(() => {
        this.weekRange = { start, end };
        this.selectedDate = date;
        this.cdr.markForCheck();
      });
    },
    select: (info) => {
      const minutes = Math.max(
        15,
        Math.round((info.end.getTime() - info.start.getTime()) / 60_000),
      );
      this.openForm({
        date: info.start,
        time: this.formatTime(info.start),
        duration: String(Math.min(120, minutes)),
        doctorId: this.selectedDoctor,
        doctorName: this.doctorLabel(this.selectedDoctor),
      });
    },
    eventClick: (info) => {
      const event = this.allEvents.find((item) => item.id === info.event.id);
      if (!event) return;

      this.openForm({
        id: event.id,
        patientId: event.extendedProps.patientId,
        patientName: event.extendedProps.patientName,
        date: event.start,
        time: this.formatTime(event.start),
        duration: String((event.end.getTime() - event.start.getTime()) / 60_000),
        doctorId: event.extendedProps.employeeId,
        doctorName: event.extendedProps.employeeName,
        reason: event.extendedProps.description,
        notes: event.extendedProps.notes,
        status: event.extendedProps.status,
      });
    },
  };

  ngOnInit(): void {
    this.selectedBranch$
      .pipe(
        filter((branch): branch is Branch => branch !== null),
        switchMap((branch) => this.loadAppointments(branch)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ appointments, doctors }) => this.setAppointments(appointments, doctors));
  }

  ngAfterViewInit(): void {
    this.updateResponsiveView();
    void this.updateCalendarLocale(this.languageService.language());
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateResponsiveView();
  }

  private updateResponsiveView(): void {
    if (!this.calendar) return;

    const compactToolbar = window.matchMedia('(max-width: 399px)').matches;
    this.isCompactToolbar.set(compactToolbar);

    const view = window.matchMedia('(max-width: 640px)').matches
      ? 'timeGridDay'
      : 'timeGridWeek';
    this.isMobileView.set(view === 'timeGridDay');
    if (this.calendar.getApi().view.type !== view) {
      this.calendar.getApi().changeView(view);
    }
  }

  private async updateCalendarLocale(language: LanguageCode): Promise<void> {
    const requestId = ++this.localeLoadId;
    try {
      const locale =
        language === 'ro'
          ? await import('fullcalendar/locales/ro')
          : language === 'ru'
            ? await import('fullcalendar/locales/ru')
            : await import('fullcalendar/locales/en-gb');

      if (requestId !== this.localeLoadId) return;
      const component = this.calendar;
      if (!component) return;
      const calendar = component.getApi();
      calendar.setOption('locales', [locale.default]);
      calendar.setOption('locale', language === 'en' ? 'en-gb' : language);
    } catch (error) {
      console.error(`Failed to load ${language} calendar locale:`, error);
    }
  }

  refreshAppointments(): void {
    const branch = this.branchStore.selectedBranch();
    if (!branch) return;

    this.loadAppointments(branch)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ appointments, doctors }) => this.setAppointments(appointments, doctors));
  }

  onAppointmentSaved(appointment: AppointmentResponse): void {
    const event = this.toEvent(appointment, this.doctorsByName);
    if (!event) return;

    this.allEvents = [...this.allEvents.filter((item) => item.id !== event.id), event];
    this.applyFilter();
  }

  private loadAppointments(branch: Branch) {
    this.isLoading.set(true);
    this.changeError.set('');

    return forkJoin({
      appointments: this.appointmentService.getAppointments(branch.branchId),
      doctors: this.userService.getDoctors(branch.branchId),
    }).pipe(
      catchError((error) => {
        console.error(error);
        this.changeError.set(
          this.httpErrorService.message(error, 'Could not load appointments. Please try again.'),
        );
        return EMPTY;
      }),
      finalize(() => {
        this.isLoading.set(false);
        this.cdr.markForCheck();
      }),
    );
  }

  private setAppointments(
    appointments: AppointmentResponse[],
    doctors: DoctorResponse[],
  ): void {
    this.doctorsById = new Map(doctors.map((doctor) => [doctor.doctorId, doctor]));
    this.doctorsByName = new Map(
      doctors.map((doctor) => [
        `${doctor.name} ${doctor.surname}`.trim().toLowerCase(),
        doctor,
      ]),
    );

    this.doctors = doctors;
    this.doctorColors = new Map(
      doctors.map((doctor) => [doctor.doctorId, doctor.calendarColor]),
    );
    this.allEvents = appointments
      .map((appointment) => this.toEvent(appointment, this.doctorsByName))
      .filter((event): event is CalendarEvent => event !== null);
    this.applyFilter();
  }

  openForm(data: AppointmentFormData | null = null): void {
    this.formData = data;
    this.isFormOpen = true;
    this.calendar?.getApi().unselect();
    this.cdr.markForCheck();
  }

  closeForm(): void {
    this.isFormOpen = false;
    this.formData = null;
    this.cdr.markForCheck();
  }

  confirmChange(): void {
    this.isConfirmPopupOpen = false;
    const change = this.pendingCalendarChange;
    this.pendingCalendarChange = null;
    if (change) this.saveCalendarChange(change);
    this.cdr.markForCheck();
  }

  cancelChange(): void {
    this.isConfirmPopupOpen = false;
    this.pendingCalendarChange?.revert();
    this.pendingCalendarChange = null;
    this.cdr.markForCheck();
  }

  private formatTime(date: Date): string {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  private doctorLabel(id: string): string {
    return this.doctorOptions.find((option) => option.value === id)?.label ?? '';
  }

  private toEvent(
    appointment: AppointmentResponse,
    doctorsByName: Map<string, DoctorResponse>,
  ): CalendarEvent | null {
    const start = new Date(appointment.appointmentDate);
    if (
      Number.isNaN(start.getTime()) ||
      !Number.isFinite(appointment.durationMinutes) ||
      appointment.durationMinutes <= 0
    ) {
      return null;
    }

    const patientName = appointment.patient
      ? `${appointment.patient.name} ${appointment.patient.surname}`.trim()
      : 'Unknown patient';
    const doctor =
      this.doctorsById.get(appointment.employee.employeeId) ??
      doctorsByName.get(
        `${appointment.employee.name} ${appointment.employee.surname}`.trim().toLowerCase(),
      );
    const employeeId = doctor?.doctorId ?? appointment.employee.employeeId;
    const color = doctor?.calendarColor ?? this.doctorColors.get(employeeId) ?? '#2856d8';

    return {
      id: appointment.appointmentId,
      title: patientName,
      start,
      end: new Date(start.getTime() + appointment.durationMinutes * 60_000),
      color,
      backgroundColor: color,
      borderColor: color,
      extendedProps: {
        employeeId,
        employeeName: `${appointment.employee.name} ${appointment.employee.surname}`.trim(),
        patientId: appointment.patient.patientId ?? appointment.patient?.patientId ?? '',
        patientName,
        description: appointment.description ?? '',
        notes: appointment.notes ?? '',
        status: appointment.status,
      },
    };
  }

  private applyFilter(): void {
    const events = this.selectedDoctor
      ? this.allEvents.filter((event) => event.extendedProps.employeeId === this.selectedDoctor)
      : this.allEvents;
    this.calendarOptions = { ...this.calendarOptions, events };
    this.cdr.markForCheck();
  }

  changeWeek(direction: number): void {
    const api = this.calendar?.getApi();
    if (!api) return;
    direction < 0 ? api.prev() : api.next();
  }

  goToday(): void {
    this.calendar?.getApi().today();
  }

  onDateChange(date: Date): void {
    if (date) this.calendar?.getApi().gotoDate(date);
  }

  onDoctorChange(): void {
    this.applyFilter();
  }

  onAppointmentDeleted(appointmentId: string): void {
    this.allEvents = this.allEvents.filter((event) => event.id !== appointmentId);
    this.closeForm();
    this.applyFilter();
  }

  private requestCalendarChange(info: EventDropArg | EventResizeArg): void {
    if (this.pendingCalendarChange) {
      info.revert();
      return;
    }

    const { start, end } = info.event;
    if (!start || !end || end.getTime() <= start.getTime()) {
      info.revert();
      return;
    }

    this.pendingCalendarChange = info;
    this.isConfirmPopupOpen = true;
    this.cdr.markForCheck();
  }

  private saveCalendarChange(info: EventDropArg | EventResizeArg): void {
    const { event } = info;
    const start = event.start;
    const end = event.end;
    if (!start || !end) {
      info.revert();
      return;
    }

    const durationMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
    if (durationMinutes <= 0) {
      info.revert();
      return;
    }

    const request: UpdateAppointmentRequest = {
      appointmentDate: start.toISOString(),
      durationMinutes,
    };

    this.isSavingChange = true;
    this.changeError.set('');
    this.appointmentService
      .updateAppointment(event.id, request)
      .pipe(
        finalize(() => {
          this.isSavingChange = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe({
        next: () => {
          const stored = this.allEvents.find((item) => item.id === event.id);
          if (stored) {
            stored.start = start;
            stored.end = end;
          }
        },
        error: (error) => {
          console.error('Failed to update appointment time or duration:', error);
          this.changeError.set(
            this.httpErrorService.message(
              error,
              'Could not save this appointment change. The original time was restored.',
            ),
          );
          info.revert();
        },
      });
  }
}
