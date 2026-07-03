import { Request, Response } from 'express';
import { RefundService } from '../services/refund.service';
import { SettlementService } from '../services/settlement.service';
import { RefundRequest } from '../models/RefundRequest';
import { Refund } from '../models/Refund';
import { Settlement } from '../models/Settlement';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

export const getRefundRequestsController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role === UserRole.CUSTOMER) {
    filter.customerId = req.user!.id;
  }
  
  const requests = await RefundRequest.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: requests });
});

export const getRefundsController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role === UserRole.CUSTOMER) {
    filter.customerId = req.user!.id;
  } else if (req.user!.role === UserRole.SALON_OWNER) {
    // Note: To filter by salonId securely, fetch salon first
  }
  
  const refunds = await Refund.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: refunds });
});

export const processRefundController = catchAsync(async (req: Request, res: Response) => {
  const refundRequestId = req.params.refundRequestId as string;
  const refund = await RefundService.processRefund(refundRequestId, req.user!.id);
  res.status(200).json({ success: true, data: refund });
});

export const generateSettlementController = catchAsync(async (req: Request, res: Response) => {
  const { periodStart, periodEnd } = req.body;
  const batch = await SettlementService.generateSettlementBatch(new Date(periodStart), new Date(periodEnd), req.user!.id);
  res.status(201).json({ success: true, data: batch });
});

export const getSettlementsController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.query.salonId) {
    filter.salonId = req.query.salonId;
  }
  
  const settlements = await Settlement.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: settlements });
});
