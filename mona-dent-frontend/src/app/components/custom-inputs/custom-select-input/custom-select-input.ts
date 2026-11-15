import { Component, ElementRef, input, model, output, viewChild } from '@angular/core';
import { LucideCheck, LucideChevronDown } from '@lucide/angular';
import { TranslatePipe } from '../../../core/pipes/translate-pipe';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
  color?: string;
}

@Component({
  selector: 'app-custom-select-input',
  imports: [LucideCheck, LucideChevronDown, TranslatePipe],
  templateUrl: './custom-select-input.html',
  styleUrl: './custom-select-input.css',
  host: {
    '(document:click)': 'closeOnOutsideClick($event)',
    '(document:keydown.escape)': 'closeOnEscape()',
  },
})
export class CustomSelectInput {
  options = input<SelectOption[]>([]);
  placeholder = input<string>('Select an option');
  value = model<string>('');
  disabled = input<boolean>(false);
  widePanel = input<boolean>(false);
  searchPlaceholder = input<string>('Search...');
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');
  optionList = viewChild<ElementRef<HTMLElement>>('optionList');

  selectionChange = output<SelectOption>();

  isOpen = false;
  searchTerm = '';

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  get selectedOption(): SelectOption | undefined {
    return this.options().find((option) => option.value === this.value());
  }

  get filteredOptions(): SelectOption[] {
    const query = this.searchTerm.trim().toLowerCase();
    if (!query) return this.options();

    return this.options().filter(
      (option) =>
        option.label.toLowerCase().includes(query) || option.value.toLowerCase().includes(query),
    );
  }

  toggleDropdown(): void {
    if (this.disabled()) return;

    this.isOpen = !this.isOpen;
    this.searchTerm = '';
    if (this.isOpen) {
      setTimeout(() => {
        this.searchInput()?.nativeElement.focus();
        this.scrollSelectedOptionIntoView();
      });
    }
  }

  onSearch(event: Event): void {
    const input = event.target;
    if (input instanceof HTMLInputElement) {
      this.searchTerm = input.value;
    }
  }

  selectOption(option: SelectOption): void {
    if (option.disabled) return;

    this.value.set(option.value);
    this.selectionChange.emit(option);
    this.isOpen = false;
    this.searchTerm = '';
  }

  closeOnOutsideClick(event: MouseEvent): void {
    const target = event.target;

    if (target instanceof Node && !this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
      this.searchTerm = '';
    }
  }

  closeOnEscape(): void {
    this.isOpen = false;
    this.searchTerm = '';
  }

  private scrollSelectedOptionIntoView(): void {
    const selected = this.optionList()?.nativeElement.querySelector<HTMLElement>(
      '[data-selected="true"]',
    );
    selected?.scrollIntoView({ block: 'nearest' });
  }
}
