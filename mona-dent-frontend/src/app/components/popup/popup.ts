import { Component, output } from '@angular/core';
import { Container } from '../container/container';
import { LucideX } from '@lucide/angular';
import { Button } from '../custom-inputs/button/button';

@Component({
  selector: 'app-popup',
  imports: [Container, LucideX, Button],
  templateUrl: './popup.html',
  styleUrl: './popup.css',
})
export class Popup {
  close = output<void>();

  closePopup(): void {
    this.close.emit();
  }
}
