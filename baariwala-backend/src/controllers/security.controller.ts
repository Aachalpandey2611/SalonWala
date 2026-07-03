import { Request, Response } from 'express';
import { DeviceSession } from '../models/DeviceSession';
import { BlockedIP } from '../models/BlockedIP';
import { ThreatLog } from '../models/ThreatLog';
import { catchAsync } from '../utils/catchAsync';
import { SecurityService } from '../services/security.service';

export const getActiveSessionsController = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  
  const sessions = await DeviceSession.find({ userId, isRevoked: false, expiresAt: { $gt: new Date() } });

  res.status(200).json({ success: true, data: sessions });
});

export const blockIpController = catchAsync(async (req: Request, res: Response) => {
  const { ipAddress, reason } = req.body;
  
  await SecurityService.blockIp(ipAddress, reason);

  res.status(200).json({ success: true, message: `IP ${ipAddress} blocked` });
});

export const getThreatDashboardController = catchAsync(async (req: Request, res: Response) => {
  const threats = await ThreatLog.find().sort({ createdAt: -1 }).limit(100);
  const blockedIps = await BlockedIP.find().sort({ blockedAt: -1 }).limit(50);

  res.status(200).json({
    success: true,
    data: {
      recentThreats: threats,
      activeBlocks: blockedIps
    }
  });
});
