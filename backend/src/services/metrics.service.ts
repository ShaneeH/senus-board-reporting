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

  // This will be where we add calculations later
  getProcessedMetrics() {
    const raw = this.getAllRawData();

    return {
      fy2024: { ...raw.fy2024 },
      fy2025: { ...raw.fy2025 },
      h1_2026: { ...raw.h1_2026 }
    };
  }
}