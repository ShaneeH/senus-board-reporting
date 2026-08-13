import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(value: number | null | undefined): string {

    if (value == null) {
      return '—';
    }

    if (Math.abs(value) >= 1_000_000_000) {
      return `€${(value / 1_000_000_000).toFixed(2)}B`;
    }

    if (Math.abs(value) >= 1_000_000) {
      return `€${(value / 1_000_000).toFixed(2)}M`;
    }

    if (Math.abs(value) >= 1_000) {
      return `€${(value / 1_000).toFixed(1)}K`;
    }

    return `€${value.toLocaleString()}`;

  }

}