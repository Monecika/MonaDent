import { Component, input, output } from '@angular/core';
import { Popup } from '../popup/popup';
import { Button } from '../custom-inputs/button/button';
import { TranslatePipe } from '../../core/pipes/translate-pipe';

@Component({
  selector: 'app-base-form',
  imports: [Popup, Button, TranslatePipe],
  templateUrl: './base-form.html',
  styleUrl: './base-form.css',
})
export class BaseForm {
  formTitle = input<string>('');
  submitButton = input<string>('');
  submitDisabled = input<boolean>(false);

  close = output<void>();
  submit = output<void>();

  closeForm = () => {
    this.close.emit();
  };

  submitForm = (event: Event) => {
    event.preventDefault();
    this.submit.emit();
  };
}
