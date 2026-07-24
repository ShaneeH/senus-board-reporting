import { Injectable } from '@angular/core';
import { AIInsight } from '../models/ai-insight.model';

@Injectable({
  providedIn: 'root'
})
export class AiInsightsService {

  getInsights(): AIInsight[] {

    return [

      {
        message: 'Revenue increased by 12% compared to last quarter.',
        severity: 'success'
      },

      {
        message: 'EBITDA margin continues to improve.',
        severity: 'info'
      },

      {
        message: 'Working capital should be monitored closely.',
        severity: 'warning'
      }

    ];

  }

}