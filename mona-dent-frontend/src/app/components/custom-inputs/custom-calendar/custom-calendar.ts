import { Component, ElementRef, effect, inject, input, model, output } from '@angular/core';
import {
  LucideCalendarDays,
  LucideChevronDown,
  LucideChevronLeft,
  LucideChevronRight,
} from '@lucide/angular';
import { CustomSelectInput, SelectOption } from '../custom-select-input/custom-select-input';
import { LocalizedDatePipe } from '../../../core/pipes/localized-date-pipe';
import { LanguageCode, LanguageService } from '../../../core/services/language-service';
import { TranslatePipe } from '../../../core/pipes/translate-pipe';

@Component({
  selector: 'app-custom-calendar',
  standalone: true,
  imports: [
    LocalizedDatePipe,
    TranslatePipe,
    LucideCalendarDays,
    LucideChevronDown,
    LucideChevronLeft,
    LucideChevronRight,
    CustomSelectInput,
  ],
  templateUrl: './custom-calendar.html',
  styleUrl: './custom-calendar.css',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class CustomCalendar {
  selectedDate = model<Date>(new Date());
  selectWeek = input<boolean>(false);
  fitContent = input<boolean>(false);
  invalid = input<boolean>(false);
  placeholder = input<string>('');
  minYear = input<number | null>(null);
  maxYear = input<number | null>(null);
  value = input<Date | string | null>(null);
  dateSelected = output<Date>();
  private readonly languageService = inject(LanguageService);

  isOpen = false;
  hasSelectedValue = false;

  today = new Date();
  viewDate = new Date();

  get weekdays(): string[] {
    const locale = { ro: 'ro-RO', ru: 'ru-RU', en: 'en-GB' }[this.languageService.language()];
    const monday = new Date(Date.UTC(2024, 0, 1));
    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date(monday);
      date.setUTCDate(monday.getUTCDate() + index);
      return new Intl.DateTimeFormat(locale, { weekday: 'narrow' })
        .format(date)
        .toLocaleUpperCase(locale);
    });
  }
  get monthOptions(): SelectOption[] {
    const localeByLanguage: Record<LanguageCode, string> = {
      ro: 'ro-RO',
      ru: 'ru-RU',
      en: 'en-GB',
    };
    const locale = localeByLanguage[this.languageService.language()];
    return Array.from({ length: 12 }, (_, index) => ({
      label: new Intl.DateTimeFormat(locale, { month: 'long' }).format(new Date(2020, index, 1)),
      value: String(index),
    }));
  }

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {
    effect(() => {
      const date = this.value();

      if (!date) {
        this.hasSelectedValue = false;
        return;
      }

      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) return;

      this.hasSelectedValue = true;
      this.selectedDate.set(parsed);
      this.viewDate = new Date(parsed.getFullYear(), parsed.getMonth(), 1);
      this.selectedMonth = String(parsed.getMonth());
      this.selectedYear = String(parsed.getFullYear());
    });
  }

  get yearOptions(): SelectOption[] {
    return this.years.map((year) => ({
      label: String(year),
      value: String(year),
    }));
  }

  selectedMonth = String(this.viewDate.getMonth());
  selectedYear = String(this.viewDate.getFullYear());

  get selectedWeekStart(): Date {
    const start = new Date(this.selectedDate());
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return start;
  }

  get selectedWeekEnd(): Date {
    const end = new Date(this.selectedWeekStart);
    end.setDate(end.getDate() + 6);
    return end;
  }

  get years(): number[] {
    const currentYear = this.today.getFullYear();
    const firstYear = this.minYear() ?? currentYear - 100;
    const lastYear = this.maxYear() ?? currentYear + 5;

    return Array.from({ length: Math.max(0, lastYear - firstYear + 1) }, (_, i) => firstYear + i);
  }

  get calendarDays() {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const start = new Date(year, month, 1 - offset);

    const selectedWeekStart = new Date(this.selectedDate());
    selectedWeekStart.setHours(0, 0, 0, 0);
    selectedWeekStart.setDate(selectedWeekStart.getDate() - ((selectedWeekStart.getDay() + 6) % 7));

    const selectedWeekEnd = new Date(selectedWeekStart);
    selectedWeekEnd.setDate(selectedWeekEnd.getDate() + 6);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);

      return {
        date,
        day: date.getDate(),
        inCurrentMonth: date.getMonth() === month,
        isToday: this.sameDay(date, this.today),
        isSelected: this.sameDay(date, this.selectedDate()),
        isCurrentWeek: this.selectWeek() && date >= selectedWeekStart && date <= selectedWeekEnd,
        isWeekStart: this.sameDay(date, selectedWeekStart),
        isWeekEnd: this.sameDay(date, selectedWeekEnd),
      };
    });
  }

  toggleCalendar(): void {
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.viewDate = new Date(
        this.selectedDate().getFullYear(),
        this.selectedDate().getMonth(),
        1,
      );
    }
  }

  changeMonth(direction: number): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + direction, 1);
    this.selectedMonth = String(this.viewDate.getMonth());
    this.selectedYear = String(this.viewDate.getFullYear());
  }

  onMonthChange(value: string): void {
    this.selectedMonth = value;
    this.viewDate = new Date(this.viewDate.getFullYear(), Number(value), 1);
  }

  onYearChange(value: string): void {
    this.selectedYear = value;
    this.viewDate = new Date(Number(value), this.viewDate.getMonth(), 1);
  }

  selectDay(date: Date): void {
    const selected = new Date(date);
    if (this.selectWeek()) {
      selected.setHours(0, 0, 0, 0);
      selected.setDate(selected.getDate() - ((selected.getDay() + 6) % 7));
    }

    this.selectedDate.set(selected);
    this.hasSelectedValue = true;
    this.viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
    this.selectedMonth = String(date.getMonth());
    this.selectedYear = String(date.getFullYear());

    this.dateSelected.emit(new Date(selected));
    this.isOpen = false;
  }

  closeOnEscape(): void {
    this.isOpen = false;
  }

  closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (this.isOpen && target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  private sameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }
}
