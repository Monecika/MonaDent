import { inject, Injectable } from '@angular/core';
import { concatMap, forkJoin, from, map, Observable, toArray } from 'rxjs';
import { AppointmentResponse } from '../models/Appointment';
import { PatientResponse } from '../models/Patient';
import { PatientFile } from '../models/PatientFile';
import { PatientToothHistoryResponse, PatientToothResponse } from '../models/PatientTooth';
import { VisitResponse } from '../models/Visit';
import { AppointmentService } from './appointment-service';
import { PatientFileService } from './patient-file-service';
import { PatientToothService } from './patient-tooth-service';
import { VisitService } from './visit-service';

export interface PatientDataExportEntry {
  patient: PatientResponse;
  appointments: AppointmentResponse[];
  visits: VisitResponse[];
  teeth: PatientToothResponse[];
  toothHistory: PatientToothHistoryResponse[];
  files: PatientFile[];
}

export interface PatientDataExport {
  format: 'mona-dent-patient-data';
  version: 1;
  exportedAt: string;
  patients: PatientDataExportEntry[];
}

@Injectable({ providedIn: 'root' })
export class PatientDataExportService {
  private readonly appointmentService = inject(AppointmentService);
  private readonly visitService = inject(VisitService);
  private readonly toothService = inject(PatientToothService);
  private readonly fileService = inject(PatientFileService);

  createExport(patients: PatientResponse[]): Observable<PatientDataExport> {
    return from(patients).pipe(
      concatMap((patient) => forkJoin({
        appointments: this.appointmentService.getPatientAppointments(patient.patientId),
        visits: this.visitService.getPatientVisits(patient.patientId),
        teeth: this.toothService.getPatientTeeth(patient.patientId),
        toothHistory: this.toothService.getPatientToothHistory(patient.patientId),
        files: this.fileService.list(patient.patientId),
      }).pipe(
        map((data) => ({ patient, ...data })),
      )),
      toArray(),
      map((entries) => ({
        format: 'mona-dent-patient-data' as const,
        version: 1 as const,
        exportedAt: new Date().toISOString(),
        patients: entries,
      })),
    );
  }

  download(data: PatientDataExport, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
