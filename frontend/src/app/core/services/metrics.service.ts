import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProcessedMetrics } from '../models/metrics.model';

@Injectable({
  providedIn: 'root'
})
export class MetricsService {
  private apiUrl = 'http://localhost:5000/api/metrics';

  constructor(private http: HttpClient) {}

  getMetrics(): Observable<ProcessedMetrics> {
    return this.http.get<ProcessedMetrics>(this.apiUrl);
  }
}