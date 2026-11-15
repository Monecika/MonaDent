import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

type ButtonVariant = 'primary' | 'secondary' | 'basic' | 'danger';
type ButtonType = 'button' | 'submit';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.html',
  styleUrl: './button.css',
  imports: [RouterLink],
})
export class Button {
  click = output<void>();

  variant = input<ButtonVariant>('primary');
  type = input<ButtonType>('button');
  router = input<string>('');
  disabled = input(false);

  getStyles(): string {
    const styles: Record<ButtonVariant, string> = {
      primary: 'bg-accent text-white hover:bg-accent-hover',
      secondary: 'bg-accent-bg text-accent hover:bg-accent-bg-hover',
      basic:
        'bg-white text-accent/90 border border-border hover:border-border-hover hover:bg-accent-bg',
      danger: 'bg-error text-white hover:bg-error/90',
    };

    return styles[this.variant()];
  }

  handleClick = () => {
    this.click.emit();
  };
}
