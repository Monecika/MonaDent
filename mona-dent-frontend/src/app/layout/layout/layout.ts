import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Aside } from '../aside/aside';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
import { Footer } from '../footer/footer';
import { LucideMenu, LucideX } from '@lucide/angular';
import { TranslatePipe } from '../../core/pipes/translate-pipe';
import { PatientLiveUpdatesService } from '../../core/services/patient-live-updates-service';

@Component({
  selector: 'app-layout',
  imports: [Aside, Navbar, RouterOutlet, Footer, LucideMenu, LucideX, TranslatePipe],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout implements OnDestroy {
  private readonly patientLiveUpdates = inject(PatientLiveUpdatesService);
  readonly mobileNavOpen = signal(false);

  constructor() {
    this.patientLiveUpdates.connect();
  }

  ngOnDestroy(): void {
    this.patientLiveUpdates.disconnect();
  }
}
