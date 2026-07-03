import { Request, Response } from 'express';
import { BackupJob } from '../models/BackupJob';
import { RestoreJob } from '../models/RestoreJob';
import { DisasterRecoveryPlan } from '../models/DisasterRecoveryPlan';
import { catchAsync } from '../utils/catchAsync';
import { BackupService } from '../services/backup.service';

export const getBackupDashboardController = catchAsync(async (req: Request, res: Response) => {
  const recentBackups = await BackupJob.find().sort({ startedAt: -1 }).limit(50);
  const recentRestores = await RestoreJob.find().populate('requestedBy', 'name email').sort({ startedAt: -1 }).limit(20);
  const drPlans = await DisasterRecoveryPlan.find();

  res.status(200).json({
    success: true,
    data: { recentBackups, recentRestores, drPlans }
  });
});

export const triggerBackupController = catchAsync(async (req: Request, res: Response) => {
  const { type } = req.body;
  const job = await BackupService.triggerBackup(type);
  res.status(201).json({ success: true, data: job });
});

export const triggerRestoreController = catchAsync(async (req: Request, res: Response) => {
  const { backupJobId, targetTenantId } = req.body;
  const requestedBy = req.user!.id;
  
  const job = await BackupService.triggerRestore(backupJobId, requestedBy, targetTenantId);
  res.status(201).json({ success: true, data: job });
});
