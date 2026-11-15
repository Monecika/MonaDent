import { Component, ViewChild } from '@angular/core';
import { PageHeader } from '../../components/page-header/page-header';
import { CalendarComponent } from './components/calendar/calendar';
import { Button } from '../../components/custom-inputs/button/button';
import { LucidePlus } from '@lucide/angular';
import { AppointmentForm } from './components/appointment-form/appointment-form';
import { TranslatePipe } from '../../core/pipes/translate-pipe';

@Component({
  selector: 'app-appointments',
  imports: [PageHeader, CalendarComponent, Button, LucidePlus, AppointmentForm, TranslatePipe],
  templateUrl: './appointments.html',
  styleUrl: './appointments.css',
})
export class Appointments {
  @ViewChild(CalendarComponent)
  private calendar?: CalendarComponent;

  isFormOpen = false;

  openForm = () => {
    this.isFormOpen = true;
  };

  closeForm = () => {
    this.isFormOpen = false;
  };

  onAppointmentSaved(): void {
    this.calendar?.refreshAppointments();
  }
}
