import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';

import { MetricsResponse } from '../models/metrics-response.model';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  private http = inject(HttpClient);

  getMetrics() {
    return this.http
      .get<MetricsResponse>('http://localhost:3000/api/metrics')
      .pipe(
        map(response => {

          const current = response.data.fy2025;

          return [
            {
              title: 'Revenue',
              value: `€${current.revenue.toLocaleString()}`,
              trend: `+${current.revenueGrowthYoY}%`
            },
            {
              title: 'Gross Margin',
              value: `${current.grossMargin}%`,
              trend: ''
            },
            {
              title: 'Cash',
              value: `€${current.cashAndEquivalents.toLocaleString()}`
            },
            {
              title: 'Customers',
              value: current.customers?.toString() ?? 'N/A'
            }
          ];

        })
      );
  }

  getFinancialData() {
    return this.http.get<MetricsResponse>(
      'http://localhost:3000/api/metrics'
    );
  }

}