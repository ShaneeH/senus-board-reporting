import { Request, Response } from 'express';
import { MetricsService } from '../services/metrics.service';

const metricsService = new MetricsService();

export class MetricsController {
  static getMetrics(req: Request, res: Response) {
    try {
      const processed = metricsService.getProcessedMetrics();
      res.json({
        success: true,
        data: processed
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error fetching metrics'
      });
    }
  }
}