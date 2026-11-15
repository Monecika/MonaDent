import { Component, inject, signal, viewChild } from '@angular/core';
import { Searchbar } from '../../components/custom-inputs/searchbar/searchbar';
import { UserDropdown } from '../user-dropdown/user-dropdown';
import { CustomSelect } from '../../components/custom-inputs/custom-select/custom-select';
import {
  CustomSelectInput,
  SelectOption,
} from '../../components/custom-inputs/custom-select-input/custom-select-input';
import { Router } from '@angular/router';
import { LanguageCode, LanguageService } from '../../core/services/language-service';
import { UserService } from '../../core/services/user-service';
import { UserStore } from '../../core/stores/user-store';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { HttpErrorService } from '../../core/services/http-error-service';

@Component({
  selector: 'app-navbar',
  imports: [Searchbar, UserDropdown, CustomSelect, CustomSelectInput, TranslatePipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private readonly languageService = inject(LanguageService);
  private readonly userService = inject(UserService);
  private readonly userStore = inject(UserStore);
  private readonly httpErrorService = inject(HttpErrorService);

  searchbar = viewChild(Searchbar);

  searchTerm = signal('');
  readonly languageSaveError = signal('');
  readonly language = this.languageService.language;
  readonly user = this.userStore.user;
  readonly userLoadError = this.userStore.loadError;
  readonly languages: SelectOption[] = [
    { value: 'ro', label: 'Romanian' },
    { value: 'ru', label: 'Russian' },
    { value: 'en', label: 'English' },
  ];

  onLanguageChange(option: SelectOption): void {
    const value = option.value;
    if (value !== 'ro' && value !== 'ru' && value !== 'en') return;
    const language: LanguageCode = value;

    this.languageService.setLanguage(language);
    this.languageSaveError.set('');

    if (!this.userStore.user()) return;

    this.userService.updatePreferredLanguage(language).subscribe({
      next: (user) => this.userStore.user.set(user),
      error: (error) => {
        console.error('Failed to save preferred language:', error);
        this.languageSaveError.set(
          this.httpErrorService.message(error, 'Could not save your language preference.'),
        );
      },
    });
  }

  onSearch = async (input: string) => {
    const search = input.trim();

    const navigated = await this.router.navigate(['/patients'], {
      queryParams: {
        search: search || null,
      },
      replaceUrl: true,
    });

    if (navigated) {
      this.searchTerm.set(search);
      this.searchbar()?.clear();
    }
  };
}
