import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClient } from './api-client';
import { PatientFile } from '../models/PatientFile';

@Injectable({ providedIn: 'root' })
export class PatientFileService {
  private readonly api = inject(ApiClient);

  list(patientId: string): Observable<PatientFile[]> {
    return this.api.get<PatientFile[]>(`patients/${patientId}/files`);
  }

  upload(patientId: string, file: File): Observable<PatientFile> {
    const data = new FormData();
    data.append('file', file);
    return this.api.upload<PatientFile>(`patients/${patientId}/files`, data);
  }

  download(patientId: string, fileId: string): Observable<Blob> {
    return this.api.download(`patients/${patientId}/files/${fileId}`);
  }

  thumbnail(patientId: string, fileId: string): Observable<Blob> {
    return this.api.download(`patients/${patientId}/files/${fileId}/thumbnail`);
  }

  delete(patientId: string, fileId: string): Observable<void> {
    return this.api.delete(`patients/${patientId}/files/${fileId}`);
  }
}
