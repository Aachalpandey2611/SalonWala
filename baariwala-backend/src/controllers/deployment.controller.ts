import { Request, Response } from 'express';
import { DeploymentHistory, DeploymentStatus } from '../models/DeploymentHistory';
import { ReleaseNote } from '../models/ReleaseNote';
import { catchAsync } from '../utils/catchAsync';
import { EventBusService } from '../services/eventBus.service';

export const getDeploymentHistoryController = catchAsync(async (req: Request, res: Response) => {
  const deployments = await DeploymentHistory.find().sort({ startedAt: -1 }).limit(50);
  res.status(200).json({ success: true, data: deployments });
});

export const getReleasesController = catchAsync(async (req: Request, res: Response) => {
  const releases = await ReleaseNote.find().sort({ releasedAt: -1 }).limit(50);
  res.status(200).json({ success: true, data: releases });
});

// This endpoint is hit by GitHub Actions webhook
export const logDeploymentWebhookController = catchAsync(async (req: Request, res: Response) => {
  const { environment, version, commitHash, status, deployedBy, logsUrl } = req.body;

  const deployment = await DeploymentHistory.create({
    environment,
    version,
    commitHash,
    status,
    deployedBy,
    logsUrl,
    startedAt: new Date(),
    completedAt: status === DeploymentStatus.SUCCESS || status === DeploymentStatus.FAILED ? new Date() : undefined
  });
  
  await EventBusService.publish('DeploymentLogged', { deploymentId: deployment._id, status });

  res.status(201).json({ success: true, data: deployment });
});
