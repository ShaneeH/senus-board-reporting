import { readFileSync } from 'fs';
import { join } from 'path';

export class MetricsService {
  private loadRawData(period: string) {
    const filePath = join(__dirname, '../data/raw', `${period}.json`);
    const data = readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  }

  getAllRawData() {
    return {
      fy2024: this.loadRawData('fy2024'),
      fy2025: this.loadRawData('fy2025'),
      h1_2026: this.loadRawData('h1_2026')
    };
  }

  getProcessedMetrics() {
    const raw = this.getAllRawData();

    const fy2025 = { ...raw.fy2025 };
    const fy2024 = { ...raw.fy2024 };

    // Calculations
    const revenueGrowthYoY = fy2024.revenue ? 
      ((fy2025.revenue - fy2024.revenue) / fy2024.revenue) * 100 : 0;

    const grossMargin = fy2025.grossProfit && fy2025.revenue ?
      (fy2025.grossProfit / fy2025.revenue) * 100 : 0;

    return {
      fy2024: {
        ...fy2024,
        grossMargin: (fy2024.grossProfit && fy2024.revenue) ? 
          (fy2024.grossProfit / fy2024.revenue * 100) : 0
      },
      fy2025: {
        ...fy2025,
        revenueGrowthYoY: parseFloat(revenueGrowthYoY.toFixed(1)),
        grossMargin: parseFloat(grossMargin.toFixed(1)),
        avgRevenuePerCustomer: fy2025.customers ? 
          Math.round(fy2025.revenue / fy2025.customers) : 0
      },
      h1_2026: {
        ...raw.h1_2026
      }
    };
  }
}