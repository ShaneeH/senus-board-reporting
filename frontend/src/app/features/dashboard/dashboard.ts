import { Component, inject } from '@angular/core';
import { MetricCard } from '../../shared/components/metric-card/metric-card';
import { Metric } from '../../core/models/metrics.model';
import { MetricService } from '../../core/services/metrics.serice';
import { AiInsights } from './components/ai-insights/ai-insights';


@Component({
  selector: 'app-dashboard',
  imports: [MetricCard, AiInsights],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private metricService = inject(MetricService);
  metrics : Metric[] = [];

  ngOnInit(){

    this.metrics = this.metricService.getMetrics();
    console.log(this.metrics);
  }
  

}