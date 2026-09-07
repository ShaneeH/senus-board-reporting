import { Component, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { CurrencyFormatPipe } from '../../pipes/currency-format-pipe';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [
        CurrencyFormatPipe,
        DecimalPipe
    ],
    templateUrl: './kpi-card.html',
    styleUrl: './kpi-card.css'
})
export class KpiCardComponent {

    title = input.required<string>();

    value = input.required<number | null>();

    change = input<number | null>(null);

    format = input<'currency' | 'number' | 'percent'>('number');

}