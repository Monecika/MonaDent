import { Pipe, PipeTransform, inject } from '@angular/core';
import { LanguageService } from '../services/language-service';

const localeByLanguage = {
  ro: 'ro',
  ru: 'ru',
  en: 'en-GB',
} as const;

@Pipe({
  name: 'localizedDate',
  pure: false,
})
export class LocalizedDatePipe implements PipeTransform {
  private readonly languageService = inject(LanguageService);

  transform(value: string | number | Date | null | undefined, format = 'mediumDate'): string | null {
    if (value === null || value === undefined) return null;

    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return null;

    const locale = localeByLanguage[this.languageService.language()];
    const time = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }).format(date);

    if (format === 'HH:mm') return time;

    if (format.startsWith('yyyy-MM-dd')) {
      const datePart = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-');
      return format.includes('HH:mm') ? `${datePart} · ${time}` : datePart;
    }

    const datePart = new Intl.DateTimeFormat(locale, {
      day: format.includes('dd') ? '2-digit' : 'numeric',
      month: format.includes('MMMM') ? 'long' : 'short',
      year: /y{1,4}/.test(format) ? 'numeric' : undefined,
    }).format(date);

    return format.includes('HH:mm') ? `${datePart} · ${time}` : datePart;
  }
}
