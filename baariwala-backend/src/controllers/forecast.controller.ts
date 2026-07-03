import { Request, Response } from 'express';
import { ForecastService } from '../services/forecast.service';
import { AIRecommendation } from '../models/AIRecommendation';
import { AIInsightAudit, InsightAuditAction } from '../models/AIInsightAudit';
import { ForecastSnapshot } from '../models/ForecastSnapshot';
import { catchAsync } from '../utils/catchAsync';
import { ForecastDomain } from '../models/ForecastModel';

export const getRevenueForecastController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const branchId = req.query.branchId as string;

  // Ideally fetches the latest snapshot, but for testing we generate it dynamically
  const snapshot = await ForecastService.generateRevenueForecast(salonId, branchId);

  res.status(200).json({ success: true, data: snapshot });
});

export const getRecommendationsController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const branchId = req.query.branchId as string;

  const recommendations = await ForecastService.getRecommendations(salonId, branchId);

  res.status(200).json({ success: true, data: recommendations });
});

export const actionRecommendationController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const userId = req.user!.id;
  const recommendationId = req.params.id;
  const { status } = req.body;

  const rec = await AIRecommendation.findOneAndUpdate(
    { _id: recommendationId, salonId },
    { status, actionedBy: userId, actionedAt: new Date() },
    { new: true }
  );

  if (!rec) {
    return res.status(404).json({ success: false, message: 'Recommendation not found' });
  }

  await AIInsightAudit.create({
    salonId,
    userId,
    action: status === 'ACCEPTED' ? InsightAuditAction.RECOMMENDATION_ACCEPTED : InsightAuditAction.RECOMMENDATION_REJECTED,
    details: { recommendationId, status }
  });

  res.status(200).json({ success: true, message: `Recommendation ${status}`, data: rec });
});
