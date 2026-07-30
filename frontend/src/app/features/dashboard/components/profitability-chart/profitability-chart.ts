import { Component, OnInit, input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';

import { MetricsResponse } from '../../../../core/models/metrics-response.model';

export type ProfitabilityChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  tooltip: ApexTooltip;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-profitability-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './profitability-chart.html',
  styleUrl: './profitability-chart.css'
})
export class ProfitabilityChart implements OnInit {

  financialData = input.required<MetricsResponse>();

  chartOptions!: ProfitabilityChartOptions;

  ngOnInit(): void {

    const data = this.financialData().data;

    this.chartOptions = {

      series: [

        {
          name: 'Gross Profit',
          data: [
            data.fy2024.grossProfit ?? 0,
            data.fy2025.grossProfit ?? 0,
 
          ]
        },

        {
          name: 'Operating Loss',
          data: [
            data.fy2024.operatingLoss ?? 0,
            data.fy2025.operatingLoss ?? 0,

          ]
        },

        {
          name: 'Net Loss',
          data: [
            data.fy2024.netLoss ?? 0,
            data.fy2025.netLoss ?? 0,
  
          ]
        }

      ],

      chart: {
        type: 'bar',
        height: 350,
        toolbar: {
          show: false
        }
      },

      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '55%'
        }
      },

      dataLabels: {
        enabled: false
      },

      stroke: {
        show: true,
        width: 2,
        colors: ['transparent']
      },

      xaxis: {
        categories: [
          'FY2024',
          'FY2025',
   
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

      legend: {
        position: 'top'
      },

      tooltip: {
        y: {
          formatter: (value: number) => `€${value.toLocaleString()}`
        }
      },

      title: {
        text: 'Profitability',
        align: 'left'
      }

    };

  }

}