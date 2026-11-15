import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from './language-service';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {
  private readonly apiUrl = '/api';

  private httpClient: HttpClient = inject(HttpClient);
  private readonly languageService = inject(LanguageService);

  get<T>(endpoint: string, params?: Record<string, string>) {
    return this.httpClient.get<T>(`${this.apiUrl}/${endpoint}`, {
      params: params ? new HttpParams({ fromObject: params }) : undefined,
      headers: { 'Accept-Language': this.languageService.language() },
    });
  }

  post<TResponse, TRequest>(endpoint: string, data: TRequest): Observable<TResponse> {
    return this.httpClient.post<TResponse>(`${this.apiUrl}/${endpoint}`, data, {
      headers: { 'Accept-Language': this.languageService.language() },
    });
  }

  upload<TResponse>(endpoint: string, data: FormData): Observable<TResponse> {
    return this.httpClient.post<TResponse>(`${this.apiUrl}/${endpoint}`, data, {
      headers: { 'Accept-Language': this.languageService.language() },
    });
  }

  download(endpoint: string): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${endpoint}`, {
      responseType: 'blob',
      headers: { 'Accept-Language': this.languageService.language() },
    });
  }

  put<TResponse, TRequest>(endpoint: string, data: TRequest): Observable<TResponse> {
    return this.httpClient.put<TResponse>(`${this.apiUrl}/${endpoint}`, data, {
      headers: { 'Accept-Language': this.languageService.language() },
    });
  }

  delete(path: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${path}`, {
      headers: { 'Accept-Language': this.languageService.language() },
    });
  }
}
