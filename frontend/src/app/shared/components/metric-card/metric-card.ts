import { Component, input } from '@angular/core';

@Component({
  selector: 'app-metric-card',
  imports: [],
  templateUrl: './metric-card.html',
  styleUrl: './metric-card.css'
})
export class MetricCard {

  title = input.required<string>();

  value = input.required<string>();

  trend = input<string>();

}