import { ForecastDomain, ModelType, ForecastModel } from '../models/ForecastModel';
import { ForecastSnapshot } from '../models/ForecastSnapshot';
import { AIRecommendation, RecommendationPriority } from '../models/AIRecommendation';
import { AnalyticsService } from './analytics.service';
import mongoose from 'mongoose';
import { redisClient } from '../config/redis';

export class ForecastService {
  
  /**
   * Simulates AI Demand/Revenue Forecasting based on historical analytics.
   * In a real enterprise system, this would call a Python ML Microservice via gRPC/REST.
   */
  static async generateRevenueForecast(salonId: string, branchId?: string) {
    // 1. Fetch Historical Data (Baseline)
    const currentRevenue = await AnalyticsService.getRevenueAnalytics(salonId, branchId);
    
    // 2. Fetch active model
    let model = await ForecastModel.findOne({ domain: ForecastDomain.REVENUE, isActive: true });
    if (!model) {
      model = await ForecastModel.create({
        name: 'RevenuePredictor_v1.0',
        domain: ForecastDomain.REVENUE,
        type: ModelType.TIME_SERIES,
        version: '1.0'
      });
    }

    // 3. Apply Heuristic Multiplier (Simulating seasonality / ML prediction)
    // E.g. Predicting next week will have +8% growth based on historical snapshot
    const growthFactor = 1.08;
    const predictedWeeklyRevenue = (currentRevenue.weeklyRevenue || 1000) * growthFactor;

    // 4. Generate Snapshot
    const snapshot = await ForecastSnapshot.create({
      salonId,
      branchId,
      domain: ForecastDomain.REVENUE,
      modelId: model._id,
      forecastDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      predictions: {
        expectedWeeklyRevenue: predictedWeeklyRevenue,
        growthPercentage: 8,
        seasonalityTrend: 'UPWARD'
      },
      confidenceScore: 88 // Simulated ML Confidence
    });

    // 5. Generate Insight Recommendation if applicable
    if (predictedWeeklyRevenue > 50000) {
      await AIRecommendation.create({
        salonId,
        branchId,
        domain: ForecastDomain.REVENUE,
        snapshotId: snapshot._id,
        title: 'Launch VIP Campaign',
        reason: 'Revenue trend is surging upward towards peak capacity.',
        suggestedAction: '/campaigns/new',
        expectedImpact: '+5% Customer Retention',
        confidenceScore: 85,
        priority: RecommendationPriority.MEDIUM
      });
    }

    return snapshot;
  }

  /**
   * Retrieves active recommendations for the dashboard
   */
  static async getRecommendations(salonId: string, branchId?: string) {
    const query: any = { salonId, status: 'PENDING' };
    if (branchId) query.branchId = branchId;
    
    return AIRecommendation.find(query).sort({ confidenceScore: -1 }).limit(10);
  }
}
