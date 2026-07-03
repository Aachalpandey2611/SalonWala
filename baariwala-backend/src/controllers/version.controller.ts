import { Request, Response } from 'express';
import { ApiVersion } from '../models/ApiVersion';
import { ApiChangelog } from '../models/ApiChangelog';
import { ClientCompatibility } from '../models/ClientCompatibility';
import { catchAsync } from '../utils/catchAsync';
import { EventBusService } from '../services/eventBus.service';

export const getVersionsController = catchAsync(async (req: Request, res: Response) => {
  const versions = await ApiVersion.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: versions });
});

export const getChangelogController = catchAsync(async (req: Request, res: Response) => {
  const changelog = await ApiChangelog.find().populate('versionId').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: changelog });
});

export const updateClientCompatController = catchAsync(async (req: Request, res: Response) => {
  const { platform, minSupportedVersion, latestVersion, deprecationWarningThreshold } = req.body;
  
  const compat = await ClientCompatibility.findOneAndUpdate(
    { platform },
    { minSupportedVersion, latestVersion, deprecationWarningThreshold },
    { upsert: true, new: true }
  );
  
  await EventBusService.publish('ClientCompatUpdated', { platform });

  res.status(200).json({ success: true, data: compat });
});
