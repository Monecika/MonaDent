export type ToothType = 'PRIMARY' | 'PERMANENT';

export type ToothFinding =
  | 'NOT_ASSESSED'
  | 'HEALTHY'
  | 'CARIES'
  | 'PULPITIS'
  | 'PERIODONTITIS'
  | 'PERIODONTAL_DISEASE'
  | 'ROOT_PROBLEM'
  | 'FILLING'
  | 'CROWN'
  | 'IMPLANT'
  | 'MISSING';
export type MobilityGrade = 1 | 2 | 3;

export interface PatientToothResponse {
  toothId: string;
  patientId: string;
  toothNumber: number;
  toothType: ToothType;
  findings: ToothFinding[];
  mobilityGrade?: MobilityGrade;
  notes?: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface CreatePatientToothRequest {
  toothNumber: number;
  toothType: ToothType;
  findings?: ToothFinding[];
  mobilityGrade?: MobilityGrade | null;
  notes?: string;
}

export interface UpdatePatientToothRequest {
  findings: ToothFinding[] | null;
  mobilityGrade: MobilityGrade | null;
  notes: string | null;
}

export interface PatientToothHistoryResponse {
  historyId: string;
  patientToothId: string;
  toothNumber: number;
  toothType: ToothType;
  previousToothNumber?: number;
  previousToothType?: ToothType;
  eventType: string;
  oldFindings: ToothFinding[];
  newFindings: ToothFinding[];
  oldMobilityGrade?: MobilityGrade;
  newMobilityGrade?: MobilityGrade;
  description: string;
  notes?: string;
  changedBy: string;
  changedAt: string;
}
