import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
    Chart,
    ChartConfiguration,
    ChartOptions,
    registerables
} from 'chart.js';

import {
    HistoryPeriod
} from '../../../core/models/history-period.model';

Chart.register(...registerables);

@Component({
    selector: 'app-customer-chart',
    standalone: true,
    imports: [
        BaseChartDirective
    ],
    templateUrl: './customer-chart.html',
    styleUrl: './customer-chart.css'
})
export class CustomerChartComponent {

    @Input()
    set history(history: HistoryPeriod[]) {

        this.chartData = {

            labels: history.map(
                period => period.periodLabel
            ),

            datasets: [
                {
                    label: 'Customers',

                    data: history.map(
                        period =>
                            Number(period.customers ?? 0)
                    ),

                    borderWidth: 1,

                    borderRadius: 6,

                    borderSkipped: false,

                    maxBarThickness: 70
                }
            ]

        };

    }


    chartData: ChartConfiguration<'bar'>['data'] = {
        labels: [],
        datasets: []
    };


    chartOptions: ChartOptions<'bar'> = {

        responsive: true,

        maintainAspectRatio: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                callbacks: {

                    label: context => {

                        const value =
                            context.parsed.y ?? 0;

                        return `${value.toLocaleString()} customers`;

                    }

                }

            }

        },

        scales: {

            x: {

                ticks: {
                    color: '#a1a1aa'
                },

                grid: {
                    display: false
                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    color: '#a1a1aa',

                    callback: value =>
                        Number(value).toLocaleString()

                },

                grid: {
                    color: '#27272a'
                }

            }

        }

    };

}