import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { dynamicMessages, translations } from '../data/language-translations';
import type { LanguageCode } from '../data/language-translations';

export type { LanguageCode } from '../data/language-translations';

const supportedLanguages: LanguageCode[] = ['ro', 'ru', 'en'];

function isLanguageCode(language: string | null | undefined): language is LanguageCode {
  return supportedLanguages.some((supportedLanguage) => supportedLanguage === language);
}

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly storage = this.document.defaultView?.localStorage;
  readonly language = signal<LanguageCode>(this.readStoredLanguage());

  constructor() {
    this.document.documentElement.lang = this.language();
  }

  setLanguage(language: LanguageCode): void {
    this.language.set(language);
    this.document.documentElement.lang = language;
    this.storage?.setItem('preferredLanguage', language);
  }

  setLanguageFromProfile(language: string | null | undefined): void {
    if (isLanguageCode(language)) {
      this.setLanguage(language);
    }
  }

  translate(value: string): string {
    const language = this.language();
    const translation = translations[language][value];
    if (translation) return translation;

    for (const dynamicMessage of dynamicMessages) {
      const match = value.match(dynamicMessage.pattern);
      if (!match) continue;

      const template = translations[language][dynamicMessage.key];
      if (!template) return value;
      return dynamicMessage.parameters.reduce(
        (translated, parameter, index) =>
          translated.replace(`{${parameter}}`, match[index + 1]),
        template,
      );
    }

    return value;
  }

  private readStoredLanguage(): LanguageCode {
    const stored = this.storage?.getItem('preferredLanguage');
    return isLanguageCode(stored) ? stored : 'ro';
  }
}
