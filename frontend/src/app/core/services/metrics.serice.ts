import { Injectable } from '@angular/core';
import { Metric } from '../models/metrics.model';

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  getMetrics(): Metric[] {

    return [

      {
        title: 'Revenue (DUMMY DATA)',
        value: '€24.8m',
        trend: '+12%'
      },

      {
        title: 'EBITDA',
        value: '18.4%',
        trend: '+5%'
      },

      {
        title: 'Cash',
        value: '€3.2m',
        trend: '+€450k'
      },

      {
        title: 'ROCE',
        value: '21.6%',
        trend: '+1.4%'
      }

    ];

  }
}

