import { Component, inject } from '@angular/core';

import { MetricCard } from '../../shared/components/metric-card/metric-card';
import { AiInsights } from './components/ai-insights/ai-insights';
import { RevenueChart } from './components/revenue-chart/revenue-chart';

import { Metric } from '../../core/models/metrics.model';
import { AIInsight } from '../../core/models/ai-insight.model';
import { MetricsResponse } from '../../core/models/metrics-response.model';

import { MetricService } from '../../core/services/metrics.service';
import { AiInsightsService } from '../../core/services/ai-insights.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    MetricCard,
    AiInsights,
    RevenueChart
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  private metricService = inject(MetricService);
  private aiInsightsService = inject(AiInsightsService);

  metrics: Metric[] = [];
  insights: AIInsight[] = [];

  financialData?: MetricsResponse;

  ngOnInit(): void {

    // KPI Cards
    this.metricService.getMetrics().subscribe(metrics => {
      this.metrics = metrics;
    });

    // Raw financial data (used for charts)
    this.metricService.getFinancialData().subscribe(response => {
      this.financialData = response;
    });

    // AI Insights
    this.insights = this.aiInsightsService.getInsights();

  }

}