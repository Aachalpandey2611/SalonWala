import { Request, Response } from 'express';
import { QueueService } from '../services/queue.service';
import { catchAsync } from '../utils/catchAsync';
import { QueueEntryStatus } from '../models/QueueEntry';
import { Queue } from '../models/Queue';
import { AppError } from '../utils/AppError';

export const joinQueueController = catchAsync(async (req: Request, res: Response) => {
  const entry = await QueueService.joinQueue(req.body);
  res.status(201).json({ success: true, data: entry });
});

export const getLiveQueueController = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.query.barberId as string;
  const date = req.query.date as string;
  if (!barberId || !date) throw new AppError('Barber ID and Date are required', 400);
  
  const queue = await Queue.findOne({ barberId, date } as any).populate('currentlyServingEntryId nextCustomerEntryId');
  if (!queue) {
    return res.status(200).json({ success: true, data: null });
  }
  
  res.status(200).json({ success: true, data: queue });
});

export const recalculateQueueController = catchAsync(async (req: Request, res: Response) => {
  const { barberId, date, salonId } = req.body;
  await QueueService.recalculateQueue(barberId, date, salonId);
  res.status(200).json({ success: true, message: 'Queue recalculated successfully' });
});

export const updateQueueEntryStatusController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body; // IN_SERVICE, COMPLETED, SKIPPED
  
  const entry = await QueueService.updateEntryStatus(id, status as QueueEntryStatus, req.user!.id);
  res.status(200).json({ success: true, data: entry });
});
