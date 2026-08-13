import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
    Chart,
    ChartConfiguration,
    ChartOptions,
    registerables
} from 'chart.js';

import { HistoryPeriod } from '../../../core/models/history-period.model';

Chart.register(...registerables);

@Component({
    selector: 'app-revenue-chart',
    standalone: true,
    imports: [
        BaseChartDirective
    ],
    templateUrl: './revenue-chart.html',
    styleUrl: './revenue-chart.css'
})
export class RevenueChartComponent {

    @Input()
    set history(history: HistoryPeriod[]) {

        console.log('Revenue chart history:', history);

        this.chartData = {

            labels: history.map(
                item => item.periodLabel
            ),

            datasets: [
                {
                    label: 'Revenue',

                    data: history.map(
                        item => Number(item.revenue)
                    ),

                    borderColor: '#ffffff',

                    backgroundColor: 'rgba(255, 255, 255, 0.05)',

                    borderWidth: 2,

                    tension: 0.35,

                    fill: true,

                    pointRadius: 4,

                    pointBackgroundColor: '#ffffff',

                    pointBorderColor: '#18181b',

                    pointBorderWidth: 2,

                    pointHoverRadius: 6
                }
            ]

        };

    }


    chartData: ChartConfiguration<'line'>['data'] = {

        labels: [],

        datasets: []

    };


    chartOptions: ChartOptions<'line'> = {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {
            mode: 'index',
            intersect: false
        },

        plugins: {

            legend: {
                display: false
            },

            tooltip: {

                backgroundColor: '#18181b',

                titleColor: '#ffffff',

                bodyColor: '#d4d4d8',

                borderColor: '#3f3f46',

                borderWidth: 1,

                callbacks: {

                    label: context => {

                        const value =
                            context.parsed.y ?? 0;

                        return new Intl.NumberFormat(
                            'en-IE',
                            {
                                style: 'currency',
                                currency: 'EUR',
                                notation: 'compact',
                                maximumFractionDigits: 2
                            }
                        ).format(value);

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
                },

                border: {
                    color: '#27272a'
                }

            },

            y: {

                beginAtZero: true,

                ticks: {

                    color: '#a1a1aa',

                    callback: value => {

                        return new Intl.NumberFormat(
                            'en-IE',
                            {
                                style: 'currency',
                                currency: 'EUR',
                                notation: 'compact',
                                maximumFractionDigits: 1
                            }
                        ).format(Number(value));

                    }

                },

                grid: {
                    color: '#27272a'
                },

                border: {
                    display: false
                }

            }

        }

    };

}