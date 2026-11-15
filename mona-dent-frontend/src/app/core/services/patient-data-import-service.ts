import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AppointmentResponse, CreateAppointmentRequest } from '../models/Appointment';
import { Branch } from '../models/Branch';
import { CreatePatientRequest, PatientResponse } from '../models/Patient';
import { DoctorResponse } from '../models/User';
import {
  PatientToothHistoryResponse,
  PatientToothResponse,
  ToothFinding,
  ToothType,
} from '../models/PatientTooth';
import { CreateVisitRequest, VisitResponse } from '../models/Visit';
import { AppointmentService } from './appointment-service';
import { BranchService } from './branch-service';
import { PatientService } from './patient-service';
import { PatientToothService } from './patient-tooth-service';
import { UserService } from './user-service';
import { VisitService } from './visit-service';
import { PatientDataExportEntry } from './patient-data-export-service';

export interface PatientDataImportResult {
  profilesCreated: number;
  profilesReused: number;
  appointments: number;
  visits: number;
  teeth: number;
  historyEvents: number;
  filesNotRestored: number;
  failures: string[];
}

@Injectable({ providedIn: 'root' })
export class PatientDataImportService {
  private readonly patientService = inject(PatientService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly visitService = inject(VisitService);
  private readonly toothService = inject(PatientToothService);
  private readonly branchService = inject(BranchService);
  private readonly userService = inject(UserService);

  async import(entries: PatientDataExportEntry[]): Promise<PatientDataImportResult> {
    const result: PatientDataImportResult = {
      profilesCreated: 0,
      profilesReused: 0,
      appointments: 0,
      visits: 0,
      teeth: 0,
      historyEvents: 0,
      filesNotRestored: entries.reduce((total, entry) => total + entry.files.length, 0),
      failures: [],
    };
    const existingPatients = await firstValueFrom(this.patientService.getPatients());
    const branches = await firstValueFrom(this.branchService.assignedBranches());
    const doctorsByBranch = new Map<string, DoctorResponse[]>();
    await Promise.all(branches.map(async (branch) => {
      try {
        doctorsByBranch.set(branch.branchId, await firstValueFrom(this.userService.getDoctors(branch.branchId)));
      } catch (error) {
        result.failures.push(`Could not load doctors for ${branch.name}: ${this.errorText(error)}`);
      }
    }));

    for (const entry of entries) {
      const sourcePatient = entry.patient;
      const profileRequest: CreatePatientRequest = {
        name: sourcePatient.name,
        surname: sourcePatient.surname,
        dateOfBirth: sourcePatient.dateOfBirth,
        phone: sourcePatient.phone,
      };
      let patient = existingPatients.find((candidate) => this.samePatient(candidate, profileRequest));
      if (patient) {
        result.profilesReused++;
      } else {
        try {
          patient = await firstValueFrom(this.patientService.createPatient(profileRequest));
          existingPatients.push(patient);
          result.profilesCreated++;
        } catch (error) {
          result.failures.push(`Could not import ${sourcePatient.name} ${sourcePatient.surname}: ${this.errorText(error)}`);
          continue;
        }
      }

      const appointmentIds = await this.restoreAppointments(entry, patient, branches, doctorsByBranch, result);
      await this.restoreVisits(entry, patient, branches, doctorsByBranch, appointmentIds, result);
      await this.restoreTeeth(entry, patient, result);
    }
    return result;
  }

  private async restoreAppointments(
    entry: PatientDataExportEntry,
    patient: PatientResponse,
    branches: Branch[],
    doctorsByBranch: Map<string, DoctorResponse[]>,
    result: PatientDataImportResult,
  ): Promise<Map<string, string>> {
    const sourceToTarget = new Map<string, string>();
    let existing: AppointmentResponse[] = [];
    try {
      existing = await firstValueFrom(this.appointmentService.getPatientAppointments(patient.patientId));
    } catch (error) {
      result.failures.push(`${patient.name}: could not load existing appointments: ${this.errorText(error)}`);
    }

    for (const appointment of entry.appointments) {
      const branch = this.findBranch(branches, appointment.branchName);
      const doctor = branch && doctorsByBranch.get(branch.branchId)?.find((candidate) =>
        this.sameName(candidate.name, appointment.employee.name) &&
        this.sameName(candidate.surname, appointment.employee.surname),
      );
      if (!branch || !doctor) {
        result.failures.push(`${patient.name}: could not match appointment ${appointment.appointmentDate} to an assigned branch and doctor.`);
        continue;
      }
      const match = existing.find((candidate) =>
        this.sameInstant(candidate.appointmentDate, appointment.appointmentDate) &&
        candidate.durationMinutes === appointment.durationMinutes &&
        candidate.employee.name === doctor.name && candidate.employee.surname === doctor.surname,
      );
      if (match) {
        sourceToTarget.set(appointment.appointmentId, match.appointmentId);
        result.appointments++;
        continue;
      }

      const request: CreateAppointmentRequest = {
        branchId: branch.branchId,
        patientId: patient.patientId,
        userId: doctor.doctorId,
        appointmentDate: appointment.appointmentDate,
        durationMinutes: appointment.durationMinutes,
        ...(appointment.description != null ? { description: appointment.description } : {}),
        ...(appointment.notes != null ? { notes: appointment.notes } : {}),
      };
      try {
        const created = await firstValueFrom(this.appointmentService.createAppointment(request));
        existing.push(created);
        sourceToTarget.set(appointment.appointmentId, created.appointmentId);
        result.appointments++;
      } catch (error) {
        result.failures.push(`${patient.name}: appointment ${appointment.appointmentDate} failed: ${this.errorText(error)}`);
      }
    }
    return sourceToTarget;
  }

  private async restoreVisits(
    entry: PatientDataExportEntry,
    patient: PatientResponse,
    branches: Branch[],
    doctorsByBranch: Map<string, DoctorResponse[]>,
    appointmentIds: Map<string, string>,
    result: PatientDataImportResult,
  ): Promise<void> {
    let existing: VisitResponse[] = [];
    try {
      existing = await firstValueFrom(this.visitService.getPatientVisits(patient.patientId));
    } catch (error) {
      result.failures.push(`${patient.name}: could not load existing visits: ${this.errorText(error)}`);
      return;
    }

    for (const visit of entry.visits) {
      const targetAppointmentId = visit.appointmentId ? appointmentIds.get(visit.appointmentId) : undefined;
      if (visit.appointmentId && !targetAppointmentId) {
        result.failures.push(`${patient.name}: visit ${visit.visitDate} was skipped because its appointment could not be imported.`);
        continue;
      }
      const match = existing.find((candidate) =>
        (targetAppointmentId && candidate.appointmentId === targetAppointmentId) ||
        (!targetAppointmentId && !candidate.appointmentId &&
          this.sameInstant(candidate.visitDate, visit.visitDate) &&
          candidate.durationMinutes === visit.durationMinutes),
      );
      if (match) {
        result.visits++;
        continue;
      }

      const branch = this.findBranch(branches, visit.branchName);
      const doctor = branch && doctorsByBranch.get(branch.branchId)?.find((candidate) =>
        this.sameName(candidate.name, visit.doctorName) &&
        this.sameName(candidate.surname, visit.doctorSurname),
      );
      if (!branch || !doctor) {
        result.failures.push(`${patient.name}: could not match visit ${visit.visitDate} to an assigned branch and doctor.`);
        continue;
      }
      const request: CreateVisitRequest = {
        branchId: branch.branchId,
        patientId: patient.patientId,
        doctorId: doctor.doctorId,
        visitDate: visit.visitDate,
        durationMinutes: visit.durationMinutes,
        ...(targetAppointmentId ? { appointmentId: targetAppointmentId } : {}),
        ...(visit.description != null ? { description: visit.description } : {}),
        ...(visit.notes != null ? { notes: visit.notes } : {}),
      };
      try {
        existing.push(await firstValueFrom(this.visitService.createVisit(request)));
        result.visits++;
      } catch (error) {
        result.failures.push(`${patient.name}: visit ${visit.visitDate} failed: ${this.errorText(error)}`);
      }
    }
  }

  private async restoreTeeth(
    entry: PatientDataExportEntry,
    patient: PatientResponse,
    result: PatientDataImportResult,
  ): Promise<void> {
    try {
      let targetTeeth = await firstValueFrom(this.toothService.getPatientTeeth(patient.patientId));
      const sourceToothById = new Map(entry.teeth.map((tooth) => [tooth.toothId, tooth]));
      for (const sourceTooth of entry.teeth) {
        let target = targetTeeth.find((tooth) =>
          tooth.toothNumber === sourceTooth.toothNumber && tooth.toothType === sourceTooth.toothType,
        );
        if (!target) {
          try {
            target = await firstValueFrom(this.toothService.addPatientTooth(patient.patientId, {
              toothNumber: sourceTooth.toothNumber,
              toothType: sourceTooth.toothType,
              findings: ['NOT_ASSESSED'],
            }));
            targetTeeth = [...targetTeeth.filter((tooth) => tooth.toothNumber !== sourceTooth.toothNumber), target];
          } catch (error) {
            result.failures.push(`${patient.name}: tooth ${sourceTooth.toothNumber} failed: ${this.errorText(error)}`);
          }
        }
      }

      const targetByPosition = new Map(targetTeeth.map((tooth) => [`${tooth.toothNumber}:${tooth.toothType}`, tooth]));
      const sourceIdToTarget = new Map<string, PatientToothResponse>();
      for (const sourceTooth of entry.teeth) {
        const target = targetByPosition.get(`${sourceTooth.toothNumber}:${sourceTooth.toothType}`);
        if (target) sourceIdToTarget.set(sourceTooth.toothId, target);
      }

      const targetHistory = await firstValueFrom(this.toothService.getPatientToothHistory(patient.patientId));
      const seenEvents = new Map<string, number>();
      targetHistory.forEach((event) => {
        const key = this.historyKey(event);
        seenEvents.set(key, (seenEvents.get(key) ?? 0) + 1);
      });
      const importedEvents = [...entry.toothHistory].sort((a, b) =>
        (a.changedAt ?? '').localeCompare(b.changedAt ?? ''),
      );
      for (const event of importedEvents) {
        const key = this.historyKey(event);
        const count = seenEvents.get(key) ?? 0;
        if (count) {
          seenEvents.set(key, count - 1);
          result.historyEvents++;
          continue;
        }
        const sourceTooth = sourceToothById.get(event.patientToothId);
        const target = sourceTooth
          ? sourceIdToTarget.get(sourceTooth.toothId)
          : targetByPosition.get(`${event.toothNumber}:${event.toothType}`);
        if (!target) {
          result.failures.push(`${patient.name}: tooth history for tooth ${event.toothNumber} could not be matched.`);
          continue;
        }
        const findings = this.toothFindings(event.newFindings);
        if (!findings?.length) {
          result.failures.push(`${patient.name}: unsupported clinical findings in history for tooth ${event.toothNumber}.`);
          continue;
        }
        try {
          const updated = await firstValueFrom(this.toothService.updatePatientTooth(patient.patientId, target.toothId, {
            findings,
            mobilityGrade: event.newMobilityGrade ?? null,
            notes: event.notes ?? null,
          }));
          sourceIdToTarget.set(sourceTooth?.toothId ?? '', updated);
          targetByPosition.set(`${updated.toothNumber}:${updated.toothType}`, updated);
          seenEvents.set(key, 1);
          result.historyEvents++;
        } catch (error) {
          result.failures.push(`${patient.name}: history for tooth ${event.toothNumber} failed: ${this.errorText(error)}`);
        }
      }

      for (const sourceTooth of entry.teeth) {
        const target = targetByPosition.get(`${sourceTooth.toothNumber}:${sourceTooth.toothType}`);
        if (!target) continue;
        if (JSON.stringify(target.findings) === JSON.stringify(sourceTooth.findings) &&
            (target.mobilityGrade ?? null) === (sourceTooth.mobilityGrade ?? null) &&
            (target.notes ?? null) === (sourceTooth.notes ?? null)) {
          result.teeth++;
          continue;
        }
        try {
          const updated = await firstValueFrom(this.toothService.updatePatientTooth(patient.patientId, target.toothId, {
            findings: sourceTooth.findings,
            mobilityGrade: sourceTooth.mobilityGrade ?? null,
            notes: sourceTooth.notes ?? null,
          }));
          targetByPosition.set(`${updated.toothNumber}:${updated.toothType}`, updated);
          result.teeth++;
        } catch (error) {
          result.failures.push(`${patient.name}: clinical findings for tooth ${sourceTooth.toothNumber} failed: ${this.errorText(error)}`);
        }
      }
    } catch (error) {
      result.failures.push(`${patient.name}: could not restore dental chart: ${this.errorText(error)}`);
    }
  }

  private samePatient(patient: PatientResponse, request: CreatePatientRequest): boolean {
    return this.sameName(patient.name, request.name) && this.sameName(patient.surname, request.surname) &&
      patient.dateOfBirth === request.dateOfBirth && patient.phone.trim() === request.phone.trim();
  }

  private sameName(a: string, b: string): boolean {
    return a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();
  }

  private sameInstant(a: string, b: string): boolean {
    return new Date(a).getTime() === new Date(b).getTime();
  }

  private findBranch(branches: Branch[], name: string): Branch | undefined {
    return branches.find((branch) => this.sameName(branch.name, name));
  }

  private historyKey(event: Pick<PatientToothHistoryResponse,
    'toothNumber' | 'toothType' | 'oldFindings' | 'newFindings' | 'oldMobilityGrade' | 'newMobilityGrade' | 'notes'>): string {
    return [event.toothNumber, event.toothType, event.oldFindings.join(','), event.newFindings.join(','),
      event.oldMobilityGrade ?? '', event.newMobilityGrade ?? '', event.notes ?? ''].join('|');
  }

  private toothFindings(values: string[]): ToothFinding[] | null {
    const findings: ToothFinding[] = [
      'NOT_ASSESSED', 'HEALTHY', 'CARIES', 'PULPITIS', 'PERIODONTITIS', 'PERIODONTAL_DISEASE',
      'ROOT_PROBLEM', 'FILLING', 'CROWN', 'IMPLANT', 'MISSING',
    ];
    const normalized = [...new Set(values.map((value) => value === 'EXTRACTED' ? 'MISSING' : value))];
    return normalized.every((value) => findings.includes(value as ToothFinding))
      ? normalized as ToothFinding[]
      : null;
  }

  private errorText(error: unknown): string {
    return error instanceof Error ? error.message : 'unknown error';
  }
}
