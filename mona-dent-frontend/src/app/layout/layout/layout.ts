import { Component, signal } from '@angular/core';
import { Aside } from '../aside/aside';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { LucideMenu, LucideX } from '@lucide/angular';
import { TranslatePipe } from '../../core/pipes/translate-pipe';

@Component({
  selector: 'app-layout',
  imports: [Aside, Navbar, RouterOutlet, Footer, LucideMenu, LucideX, TranslatePipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {
  readonly mobileNavOpen = signal(false);
}
