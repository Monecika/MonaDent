import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-container',
  standalone: true,
  templateUrl: './container.html',
  styleUrl: './container.css',
})
export class Container {
  classes = input<string>('');
}
