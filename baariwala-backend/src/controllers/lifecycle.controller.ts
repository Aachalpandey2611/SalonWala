import { Request, Response } from 'express';
import { LifecycleService } from '../services/lifecycle.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { Appointment } from '../models/Appointment';
import { UserRole } from '../constants/roles';

// Verification guard (simplified for Lifecycle, usually same as Booking Core)
const verifyAccess = async (appointmentId: string, userId: string, role: string) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment || appointment.isDeleted) throw new AppError('Appointment not found', 404);
  
  if (role === UserRole.SUPER_ADMIN) return appointment;
  if (role === UserRole.CUSTOMER && appointment.customerId.toString() !== userId) {
    throw new AppError('Unauthorized access', 403);
  }
  return appointment;
};

export const confirmBookingController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.confirmBooking(id, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});

export const checkInController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.checkIn(id, req.body.method, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});

export const assignBarberController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.assignBarber(id, req.body.barberId, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});

export const startServiceController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.startService(id, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});

export const completeServiceController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.completeService(id, req.body.notes, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});

export const cancelBookingController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.cancelBooking(id, req.body.reason, req.user!.id, req.user!.role);
  res.status(200).json({ success: true, data: appointment });
});

export const markNoShowController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.markNoShow(id, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});

export const expireBookingController = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  await verifyAccess(id, req.user!.id, req.user!.role);
  const appointment = await LifecycleService.expireBooking(id, req.user!.id);
  res.status(200).json({ success: true, data: appointment });
});
