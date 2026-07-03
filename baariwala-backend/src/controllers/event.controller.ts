import { Request, Response } from 'express';
import { EventBusService } from '../services/eventBus.service';
import { EventProcessorService } from '../services/eventProcessor.service';
import { EventModel, EventStatus } from '../models/Event';
import { DeadLetterQueue } from '../models/DeadLetterQueue';
import { EventRetryQueue } from '../models/EventRetryQueue';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const publishEventController = catchAsync(async (req: Request, res: Response) => {
  const { eventType, payload, producer, correlationId } = req.body;
  const event = await EventBusService.publish(eventType, payload, producer, correlationId);
  res.status(201).json({ success: true, data: event });
});

export const getEventsController = catchAsync(async (req: Request, res: Response) => {
  const events = await EventModel.find().sort({ createdAt: -1 }).limit(100);
  res.status(200).json({ success: true, data: events });
});

export const getPendingEventsController = catchAsync(async (req: Request, res: Response) => {
  const pending = await EventRetryQueue.find().sort({ nextRetryAt: 1 }).populate('eventId');
  res.status(200).json({ success: true, data: pending });
});

export const getDeadLetterQueueController = catchAsync(async (req: Request, res: Response) => {
  const dlq = await DeadLetterQueue.find().sort({ createdAt: -1 }).populate('eventId');
  res.status(200).json({ success: true, data: dlq });
});

export const replayDeadLetterController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const replayed = await EventProcessorService.replayDeadLetter(id);
  res.status(200).json({ success: true, data: replayed, message: 'Event replayed successfully' });
});

export const processRetryQueueController = catchAsync(async (req: Request, res: Response) => {
  // Manual trigger for testing
  const result = await EventProcessorService.processRetryQueue();
  res.status(200).json({ success: true, data: result });
});
