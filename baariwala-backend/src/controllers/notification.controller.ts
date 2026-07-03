import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import { NotificationPreference } from '../models/NotificationPreference';
import { catchAsync } from '../utils/catchAsync';

export const getNotificationsController = catchAsync(async (req: Request, res: Response) => {
  const notifications = await Notification.find({ userId: req.user!.id }).sort({ createdAt: -1 }).limit(50);
  res.status(200).json({ success: true, data: notifications });
});

export const markAsReadController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: id, userId: req.user!.id },
    { isRead: true, readAt: new Date() },
    { new: true }
  );
  res.status(200).json({ success: true, data: notification });
});

export const markAllAsReadController = catchAsync(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { userId: req.user!.id, isRead: false },
    { isRead: true, readAt: new Date() }
  );
  res.status(200).json({ success: true, message: 'All notifications marked as read' });
});

export const getPreferencesController = catchAsync(async (req: Request, res: Response) => {
  let pref = await NotificationPreference.findOne({ userId: req.user!.id });
  if (!pref) {
    pref = await NotificationPreference.create({ userId: req.user!.id });
  }
  res.status(200).json({ success: true, data: pref });
});

export const updatePreferencesController = catchAsync(async (req: Request, res: Response) => {
  const pref = await NotificationPreference.findOneAndUpdate(
    { userId: req.user!.id },
    req.body,
    { new: true, upsert: true }
  );
  res.status(200).json({ success: true, data: pref });
});
