import { SystemMetric, MetricType } from '../models/SystemMetric';
import { ServiceHealth, ServiceStatus } from '../models/ServiceHealth';
import { Alert, AlertSeverity } from '../models/Alert';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';
import mongoose from 'mongoose';

export class MonitoringService {
  
  /**
   * Records an API Latency metric
   */
  static async recordApiLatency(endpoint: string, method: string, durationMs: number) {
    try {
      await SystemMetric.create({
        type: MetricType.API_LATENCY,
        value: durationMs,
        tags: { endpoint, method }
      });
      
      // Real-time alerting trigger
      if (durationMs > 2000) {
        await this.triggerAlert(`High API Latency on ${method} ${endpoint}`, `Request took ${durationMs}ms`, AlertSeverity.WARNING, 'API_MONITOR');
      }
    } catch (error) {
      logger.error('Failed to record API Latency', error);
    }
  }

  /**
   * Health Check Pinger
   * In a real system, this runs via a CRON or setInterval loop
   */
  static async checkDatabaseHealth() {
    const start = Date.now();
    try {
      // Ping Mongo
      if (mongoose.connection.readyState === 1) {
        await this.updateServiceHealth('MongoDB', ServiceStatus.OPERATIONAL, Date.now() - start);
      } else {
        await this.updateServiceHealth('MongoDB', ServiceStatus.DOWN, 0);
        await this.triggerAlert('MongoDB is Down!', 'Mongoose connection lost', AlertSeverity.CRITICAL, 'DB_MONITOR');
      }
    } catch (error) {
      await this.updateServiceHealth('MongoDB', ServiceStatus.DOWN, 0);
    }
  }

  private static async updateServiceHealth(serviceName: string, status: ServiceStatus, responseTimeMs: number) {
    await ServiceHealth.findOneAndUpdate(
      { serviceName },
      {
        status,
        lastResponseTimeMs: responseTimeMs,
        lastChecked: new Date(),
        $inc: { errorCount: status === ServiceStatus.DOWN ? 1 : 0 }
      },
      { upsert: true }
    );
  }

  static async triggerAlert(title: string, description: string, severity: AlertSeverity, source: string) {
    // Deduplication check: Don't spam the same unresolved alert
    const existing = await Alert.findOne({ title, isResolved: false });
    if (existing) return;

    await Alert.create({ title, description, severity, source });
    logger.warn(`[ALERT] ${severity}: ${title} - ${description}`);
  }
}
