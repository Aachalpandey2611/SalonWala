import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { DashboardAudit, DashboardAuditAction } from '../models/DashboardAudit';
import { catchAsync } from '../utils/catchAsync';

export const getMyDashboardController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const role = req.user!.role;
  const userId = req.user!.id;
  const branchId = (req.query.branchId as string) || (req.user as any).branchId;

  const data = await DashboardService.getHydratedDashboard(userId, role, salonId, branchId);

  res.status(200).json({ success: true, data });
});

export const savePreferencesController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { theme, refreshInterval } = req.body;

  const pref = await DashboardService.savePreferences(userId, theme, refreshInterval);

  await DashboardAudit.create({
    salonId: (req.user as any).salonId,
    userId,
    action: DashboardAuditAction.PREFERENCE_UPDATED,
    details: { theme, refreshInterval }
  });

  res.status(200).json({ success: true, message: 'Preferences saved', data: pref });
});
