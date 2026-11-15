export type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface AppointmentResponse {
  appointmentId: string;
  branchName: string;
  patient: AppointmentPatient;
  employee: AppointmentEmployee;
  appointmentDate: string;
  durationMinutes: number;
  description?: string;
  notes?: string;
  status: AppointmentStatus;
}

export interface AppointmentEmployee {
  employeeId: string;
  role: string;
  name: string;
  surname: string;
}

export interface UpdateAppointmentRequest {
  patientId?: string | null;
  userId?: string | null;
  appointmentDate?: string | null;
  durationMinutes?: number | null;
  description?: string | null;
  notes?: string | null;
  status?: AppointmentStatus | null;
}

export interface CreateAppointmentRequest {
  branchId: string;
  patientId: string;
  userId: string;
  appointmentDate: string;
  durationMinutes: number;
  description?: string;
  notes?: string;
}

export interface AppointmentPatient {
  patientId: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  phone: string;
}
