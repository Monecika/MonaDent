export type VisitStatus = 'IN_PROGRESS' | 'COMPLETED';

export interface VisitResponse {
  visitId: string;
  branchName: string;
  patientId: string;
  doctorRole: string;
  doctorName: string;
  doctorSurname: string;
  appointmentId?: string;
  visitDate: string;
  durationMinutes: number;
  description?: string;
  notes?: string;
  status: VisitStatus;
}

export interface CreateVisitRequest {
  branchId: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string | null;
  visitDate: string;
  durationMinutes: number;
  description?: string;
  notes?: string;
}
