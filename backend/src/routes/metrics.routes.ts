import { Router } from 'express';
import { MetricsController } from '../controllers/metrics.controller';

const router = Router();

router.get('/metrics', MetricsController.getMetrics);

export default router;