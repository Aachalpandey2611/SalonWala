import { Request, Response } from 'express';
import { AuditLog } from '../models/AuditLog';
import { SecurityEvent } from '../models/SecurityEvent';
import { catchAsync } from '../utils/catchAsync';

export const getAuditLogsController = catchAsync(async (req: Request, res: Response) => {
  const tenantId = (req.user as any).tenantId;
  
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;

  const query: any = { tenantId };
  if (req.query.module) query.module = req.query.module;

  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({ success: true, data: logs });
});

export const getSecurityEventsController = catchAsync(async (req: Request, res: Response) => {
  const tenantId = (req.user as any).tenantId;
  
  const events = await SecurityEvent.find({ tenantId }).sort({ createdAt: -1 }).limit(100);

  res.status(200).json({ success: true, data: events });
});
