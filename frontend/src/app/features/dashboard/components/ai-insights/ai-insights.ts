import { Component, input } from '@angular/core';
import { AIInsight } from '../../../../core/models/ai-insight.model';

@Component({
  selector: 'app-ai-insights',
  imports: [],
  templateUrl: './ai-insights.html',
  styleUrl: './ai-insights.css'
})
export class AiInsights {

  insights = input.required<AIInsight[]>();

}