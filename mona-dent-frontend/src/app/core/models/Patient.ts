export type PatientGender = 'MALE' | 'FEMALE';

export interface PatientResponse {
  patientId: string;
  patientNumber: number;
  name: string;
  surname: string;
  dateOfBirth: string;
  gender: PatientGender | null;
  homeAddress: string | null;
  allergies: string | null;
  diseases: string | null;
  profession: string | null;
  phone: string;
  createdAt: string;
}

export interface CreatePatientRequest {
  name: string;
  surname: string;
  dateOfBirth: string;
  gender: PatientGender;
  homeAddress: string;
  allergies?: string;
  diseases?: string;
  profession?: string;
  phone: string;
}

export interface UpdatePatientRequest {
  name: string | null;
  surname: string | null;
  dateOfBirth: string | null;
  gender: PatientGender | null;
  homeAddress: string | null;
  allergies: string | null;
  diseases: string | null;
  profession: string | null;
  phone: string | null;
}
