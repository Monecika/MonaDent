import { Component, input, output } from '@angular/core';
import { Button } from '../custom-inputs/button/button';
import { Popup } from '../popup/popup';
import { TranslatePipe } from '../../core/pipes/translate-pipe';

@Component({
  selector: 'app-confirmation-dialog',
  imports: [Button, Popup, TranslatePipe],
  templateUrl: './confirmation-dialog.html',
})
export class ConfirmationDialog {
  title = input.required<string>();
  message = input.required<string>();
  confirmLabel = input('Confirm');
  cancelLabel = input('Cancel');
  confirmDisabled = input(false);
  confirmVariant = input<'primary' | 'secondary' | 'basic' | 'danger'>('primary');

  confirmed = output<void>();
  cancelled = output<void>();
}
