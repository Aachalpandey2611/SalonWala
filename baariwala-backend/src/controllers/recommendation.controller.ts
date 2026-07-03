import { Request, Response } from 'express';
import { RecommendationService } from '../services/recommendation.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const recommendBarberController = catchAsync(async (req: Request, res: Response) => {
  const { salonId, customerId } = req.query;
  const recommendation = await RecommendationService.recommendBarber(salonId as string, customerId as string | undefined);
  res.status(200).json({ success: true, data: recommendation });
});

export const recommendServiceController = catchAsync(async (req: Request, res: Response) => {
  const { salonId, serviceId, customerId } = req.query;
  const recommendation = await RecommendationService.recommendService(salonId as string, serviceId as string, customerId as string | undefined);
  res.status(200).json({ success: true, data: recommendation });
});

export const recommendSlotController = catchAsync(async (req: Request, res: Response) => {
  const { salonId, barberId, date } = req.query;
  const recommendation = await RecommendationService.recommendSlot(salonId as string, barberId as string, date as string);
  res.status(200).json({ success: true, data: recommendation });
});

export const recommendRecoveryController = catchAsync(async (req: Request, res: Response) => {
  const { salonId } = req.query;
  const recommendation = await RecommendationService.recommendRecovery(salonId as string);
  res.status(200).json({ success: true, data: recommendation });
});
