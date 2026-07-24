import { Component, OnInit, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

import { MetricsResponse } from '../../../../core/models/metrics-response.model';

export type RevenueChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-revenue-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './revenue-chart.html',
  styleUrl: './revenue-chart.css'
})
export class RevenueChart implements OnInit {

  financialData = input.required<MetricsResponse>();

  chartOptions!: RevenueChartOptions;

  ngOnInit(): void {

    const data = this.financialData().data;

    this.chartOptions = {

      series: [
        {
          name: 'Revenue',
          data: [
            data.fy2024.revenue,
            data.fy2025.revenue,
            data.h1_2026.revenue
          ]
        }
      ],

      chart: {
        type: 'area',
        height: 350,
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        curve: 'smooth',
        width: 3
      },

      xaxis: {
        categories: [
          'FY2024',
          'FY2025',
          'H1 2026'
        ]
      },

      yaxis: {
        labels: {
          formatter: (value: number) => `€${value.toLocaleString()}`
        }
      },

      grid: {
        borderColor: '#e5e7eb'
      },

      tooltip: {
        y: {
          formatter: (value: number) => `€${value.toLocaleString()}`
        }
      },

      title: {
        text: 'Revenue Trend',
        align: 'left'
      }

    };

  }

}