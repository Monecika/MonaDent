export interface PatientResponse {
  patientId: string;
  name: string;
  surname: string;
  dateOfBirth: string;
  phone: string;
  createdAt: string;
}

export interface CreatePatientRequest {
  name: string;
  surname: string;
  dateOfBirth: string;
  phone: string;
}

export interface UpdatePatientRequest {
  name: string | null;
  surname: string | null;
  dateOfBirth: string | null;
  phone: string | null;
}
