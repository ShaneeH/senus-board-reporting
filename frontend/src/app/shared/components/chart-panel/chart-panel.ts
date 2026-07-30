import { Component, input } from '@angular/core';

@Component({
  selector: 'app-chart-panel',
  standalone: true,
  templateUrl: './chart-panel.html',
  styleUrl: './chart-panel.css'
})
export class ChartPanel {

  title = input.required<string>();

}