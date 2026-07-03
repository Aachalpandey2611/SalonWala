import { Request, Response } from 'express';
import { ServiceHealth } from '../models/ServiceHealth';
import { SystemMetric, MetricType } from '../models/SystemMetric';
import { Alert } from '../models/Alert';
import { catchAsync } from '../utils/catchAsync';
import { MonitoringService } from '../services/monitoring.service';
import { AppError } from '../middlewares/error.middleware';

export const getHealthDashboardController = catchAsync(async (req: Request, res: Response) => {
  // Fire off an active check right before serving dashboard
  await MonitoringService.checkDatabaseHealth();
  
  const health = await ServiceHealth.find();
  const alerts = await Alert.find({ isResolved: false }).sort({ createdAt: -1 });
  
  // Aggregate recent latency
  const latencyMetrics = await SystemMetric.find({ type: MetricType.API_LATENCY })
    .sort({ timestamp: -1 })
    .limit(100);

  res.status(200).json({
    success: true,
    data: {
      health,
      activeAlerts: alerts,
      recentLatency: latencyMetrics
    }
  });
});

export const resolveAlertController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const alert = await Alert.findByIdAndUpdate(id, {
    isResolved: true,
    resolvedAt: new Date()
  }, { new: true });
  
  if (!alert) {
    throw new AppError('Alert not found', 404);
  }

  res.status(200).json({ success: true, data: alert });
});
