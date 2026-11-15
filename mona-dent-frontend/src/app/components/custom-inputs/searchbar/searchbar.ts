import { Component, input, output, signal, effect } from '@angular/core';
import { LucideSearch } from '@lucide/angular';

@Component({
  selector: 'app-searchbar',
  imports: [LucideSearch],
  templateUrl: './searchbar.html',
  styleUrl: './searchbar.css',
})
export class Searchbar {
  placeholder = input.required<string>();
  width = input<string>('w-full');
  value = input<string>('');

  searchChange = output<string>();
  searchSubmit = output<string>();

  searchValue = signal<string>('');

  constructor() {
    effect(() => {
      this.searchValue.set(this.value());
    });
  }

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    this.searchValue.set(value);
    this.searchChange.emit(value);
  }

  onEnter() {
    this.searchSubmit.emit(this.searchValue());
  }

  clear() {
    this.searchValue.set('');
  }
}
