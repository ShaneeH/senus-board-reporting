import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  uptime: number;
}

/**
 * Service for checking the backend API's health/status endpoint.
 */
@Injectable({
  providedIn: 'root'
})
export class HealthService {

  private http = inject(HttpClient);
  private readonly url: string = 'http://localhost:3000/api/health';


  getHealth(): Observable<HealthResponse> {
    return this.http.get<HealthResponse>(this.url);
  }


  // Returns the health endpoint URL Useful for error msg
  getUrl(): string {
    return this.url;
  }

}