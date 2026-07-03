import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { AnalyticsAuditAction } from '../models/AnalyticsAudit';
import { catchAsync } from '../utils/catchAsync';

export const getRevenueAnalyticsController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { startDate, endDate, branchId } = req.query;

  const data = await AnalyticsService.getRevenueAnalytics(
    salonId, 
    branchId as string, 
    startDate ? new Date(startDate as string) : undefined, 
    endDate ? new Date(endDate as string) : undefined
  );

  await AnalyticsService.logAccess(salonId, req.user!.id, AnalyticsAuditAction.REPORT_GENERATED, 'REVENUE');

  res.status(200).json({ success: true, data });
});

export const getBookingAnalyticsController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { branchId } = req.query;

  const data = await AnalyticsService.getBookingAnalytics(salonId, branchId as string);
  
  await AnalyticsService.logAccess(salonId, req.user!.id, AnalyticsAuditAction.REPORT_GENERATED, 'BOOKINGS');

  res.status(200).json({ success: true, data });
});

export const getCustomerAnalyticsController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  
  const data = await AnalyticsService.getCustomerAnalytics(salonId);

  await AnalyticsService.logAccess(salonId, req.user!.id, AnalyticsAuditAction.REPORT_GENERATED, 'CUSTOMERS');

  res.status(200).json({ success: true, data });
});

export const getLiveDashboardController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { branchId } = req.query;

  const data = await AnalyticsService.getLiveDashboard(salonId, branchId as string);

  await AnalyticsService.logAccess(salonId, req.user!.id, AnalyticsAuditAction.DASHBOARD_ACCESSED, 'LIVE_DASHBOARD');

  res.status(200).json({ success: true, data });
});
