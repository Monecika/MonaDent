import { Component, computed, input, output } from '@angular/core';
import { LucidePlus, LucideStethoscope } from '@lucide/angular';
import { VisitResponse } from '../../../../core/models/Visit';
import { Container } from '../../../../components/container/container';
import { Button } from '../../../../components/custom-inputs/button/button';
import { TranslatePipe } from '../../../../core/pipes/translate-pipe';
import { LocalizedDatePipe } from '../../../../core/pipes/localized-date-pipe';

@Component({
  selector: 'app-visits',
  imports: [Container, LocalizedDatePipe, LucideStethoscope, Button, LucidePlus, TranslatePipe],
  templateUrl: './visits.html',
  styleUrl: './visits.css',
})
export class Visits {
  readonly visits = input<VisitResponse[]>([]);
  readonly isLoading = input(false);
  readonly errorMessage = input('');
  readonly create = output<void>();

  readonly sortedVisits = computed(() =>
    [...this.visits()].sort((a, b) => Date.parse(b.visitDate) - Date.parse(a.visitDate)),
  );

  visitStatusLabel(status: VisitResponse['status']): string {
    return status === 'IN_PROGRESS' ? 'In progress' : 'Completed';
  }
}
