import { Request, Response } from 'express';
import { CommissionService } from '../services/commission.service';
import { Commission } from '../models/Commission';
import { CommissionRule } from '../models/CommissionRule';
import { CommissionHistory } from '../models/CommissionHistory';
import { CommissionRuleCache } from '../utils/CommissionRuleCache';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

/**
 * Get Commissions List with filters
 */
export const getCommissionsController = catchAsync(async (req: Request, res: Response) => {
  const { status, recipientId, branchId, startDate, endDate } = req.query;
  const filter: any = {};
  
  if (req.user!.role === UserRole.CUSTOMER) throw new AppError('Unauthorized', 403);
  
  if (req.user!.role === UserRole.BARBER) {
    filter.recipientId = req.user!.id; // Barbers can only see their own
  } else if (req.user!.role === UserRole.SALON_OWNER) {
    filter.salonId = (req.user as any).salonId;
  }
  
  if (recipientId && req.user!.role !== UserRole.BARBER) filter.recipientId = recipientId;
  if (status) filter.status = status;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate as string);
    if (endDate) filter.createdAt.$lte = new Date(endDate as string);
  }
  
  const commissions = await Commission.find(filter).sort({ createdAt: -1 }).limit(100);
  res.status(200).json({ success: true, data: commissions });
});

/**
 * Get Commission Summary Dashboard
 */
export const getCommissionSummaryController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  
  if (req.user!.role === UserRole.BARBER) filter.recipientId = req.user!.id;
  else if (req.user!.role === UserRole.SALON_OWNER) filter.salonId = (req.user as any).salonId;
  
  const summary = await Commission.aggregate([
    { $match: filter },
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$calculatedAmount' },
        count: { $sum: 1 }
      }
    }
  ]);
  
  res.status(200).json({ success: true, data: summary });
});

/**
 * Change Status (Approve, Reject, Lock)
 */
export const changeStatusController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const commission = await CommissionService.changeStatus(id as string, status, req.user!.id);
  res.status(200).json({ success: true, data: commission });
});

/**
 * Adjust Commission Manually
 */
export const adjustCommissionController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, amount, reason } = req.body;
  const commission = await CommissionService.adjustCommission(id as string, type, amount, reason, req.user!.id);
  res.status(200).json({ success: true, data: commission });
});

export const bulkApproveController = catchAsync(async (req: Request, res: Response) => {
  const { ids } = req.body; 
  if (!Array.isArray(ids)) throw new AppError('Expected array of ids', 400);
  
  const results = [];
  for (const id of ids) {
    try {
      const c = await CommissionService.changeStatus(id, 'APPROVED' as any, req.user!.id);
      results.push({ id, status: 'SUCCESS', commission: c });
    } catch (e: any) {
      results.push({ id, status: 'FAILED', reason: e.message });
    }
  }
  
  res.status(200).json({ success: true, data: results });
});

/**
 * Commission Rule CRUD
 */
export const createRuleController = catchAsync(async (req: Request, res: Response) => {
  const rule = await CommissionRule.create({ ...req.body, salonId: (req.user as any).salonId });
  await CommissionRuleCache.invalidateRulesCache((req.user as any).salonId);
  res.status(201).json({ success: true, data: rule });
});

export const getRulesController = catchAsync(async (req: Request, res: Response) => {
  const rules = await CommissionRuleCache.getActiveRulesForSalon((req.user as any).salonId);
  res.status(200).json({ success: true, data: rules });
});

export const getCommissionHistoryController = catchAsync(async (req: Request, res: Response) => {
  const history = await CommissionHistory.find({ commissionId: req.params.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: history });
});
