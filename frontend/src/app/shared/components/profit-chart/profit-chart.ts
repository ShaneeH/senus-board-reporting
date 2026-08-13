import { Component, Input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';

import {
    Chart,
    ChartConfiguration,
    ChartOptions,
    registerables
} from 'chart.js';

Chart.register(...registerables);

@Component({
    selector: 'app-profit-chart',
    standalone: true,
    imports: [
        BaseChartDirective
    ],
    templateUrl: './profit-chart.html',
    styleUrl: './profit-chart.css'
})
export class ProfitChartComponent {

    @Input()
    set revenue(value: number | string | null) {

        this.revenueValue = Number(value ?? 0);

        this.updateChart();

    }

    @Input()
    set grossProfit(value: number | string | null) {

        this.grossProfitValue = Number(value ?? 0);

        this.updateChart();

    }

    private revenueValue = 0;

    private grossProfitValue = 0;


    chartData: ChartConfiguration<'doughnut'>['data'] = {

        labels: [
            'Gross Profit',
            'Cost of Revenue'
        ],

        datasets: [
            {
                data: []
            }
        ]

    };


    chartOptions: ChartOptions<'doughnut'> = {

        responsive: true,

        maintainAspectRatio: false,

        cutout: '70%',

        plugins: {

            legend: {

                position: 'bottom',

                labels: {

                    color: '#a1a1aa',

                    padding: 24,

                    usePointStyle: true,

                    pointStyle: 'circle'

                }

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
                            Number(context.raw ?? 0);

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

        }

    };


    private updateChart(): void {

        const operatingCosts =
            Math.max(
                this.revenueValue - this.grossProfitValue,
                0
            );

        this.chartData = {

            labels: [
                'Gross Profit',
                'Operating Costs'
            ],

            datasets: [
                {

                    data: [
                        this.grossProfitValue,
                        operatingCosts
                    ],

                    backgroundColor: [
                        '#ffffff',
                        '#3f3f46'
                    ],

                    borderColor: '#18181b',

                    borderWidth: 3,

                    hoverOffset: 6

                }
            ]

        };

    }

}