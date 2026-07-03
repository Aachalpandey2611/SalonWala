import { Request, Response } from 'express';
import { BarberWorkingHours } from '../models/BarberWorkingHours';
import { BarberShift } from '../models/BarberShift';
import { BarberBreak } from '../models/BarberBreak';
import { BarberLeave } from '../models/BarberLeave';
import { AvailabilityException } from '../models/AvailabilityException';
import { Barber } from '../models/Barber';
import { Salon } from '../models/Salon';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

// Verification guards
const verifySalonOwnership = async (salonId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return;
  const salon = await Salon.findById(salonId);
  if (!salon) throw new AppError('Salon not found', 404);
  if (salon.ownerId.toString() !== userId && role !== UserRole.ADMIN) {
    throw new AppError('You do not have permission', 403);
  }
};

const verifyBarberAccess = async (barberId: string, userId: string, role: string) => {
  const barber = await Barber.findById(barberId);
  if (!barber) throw new AppError('Barber not found', 404);
  
  if (role === UserRole.SUPER_ADMIN) return barber;
  
  if (role === UserRole.BARBER) {
    if (barber.userId?.toString() !== userId) throw new AppError('You can only manage your own schedule', 403);
    return barber;
  }
  
  await verifySalonOwnership(barber.salonId.toString(), userId, role);
  return barber;
};

// ==========================================
// WORKING HOURS
// ==========================================
export const setWorkingHours = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  // Salon Owner or Admin can set working hours, Barber usually shouldn't but let's restrict to Owner/Admin
  if (req.user!.role === UserRole.BARBER) throw new AppError('Only Salon Owners can set base working hours', 403);
  
  const barber = await verifyBarberAccess(barberId, req.user!.id, req.user!.role);
  
  const { branchId, day, isOff, sessions } = req.body;
  
  const hours = await BarberWorkingHours.findOneAndUpdate(
    { barberId, branchId, day },
    { salonId: barber.salonId, isOff, sessions },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  
  res.status(200).json({ success: true, data: hours });
});

// ==========================================
// SHIFTS
// ==========================================
export const createShift = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  if (req.user!.role === UserRole.BARBER) throw new AppError('Only Salon Owners can assign shifts', 403);
  const barber = await verifyBarberAccess(barberId, req.user!.id, req.user!.role);
  
  const shift = await BarberShift.create({
    barberId,
    salonId: barber.salonId,
    assignedBy: req.user!.id,
    ...req.body
  });
  
  res.status(201).json({ success: true, data: shift });
});

// ==========================================
// BREAKS
// ==========================================
export const createBreak = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  // Barbers can request their own breaks
  const barber = await verifyBarberAccess(barberId, req.user!.id, req.user!.role);
  
  const breakRecord = await BarberBreak.create({
    barberId,
    salonId: barber.salonId,
    ...req.body
  });
  
  res.status(201).json({ success: true, data: breakRecord });
});

// ==========================================
// LEAVES
// ==========================================
export const requestLeave = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  const barber = await verifyBarberAccess(barberId, req.user!.id, req.user!.role);
  
  const leave = await BarberLeave.create({
    barberId,
    salonId: barber.salonId,
    ...req.body
  });
  
  res.status(201).json({ success: true, data: leave });
});

export const updateLeaveStatus = catchAsync(async (req: Request, res: Response) => {
  if (req.user!.role === UserRole.BARBER) throw new AppError('Barbers cannot approve their own leave', 403);
  
  const leave = await BarberLeave.findById(req.params.id);
  if (!leave) throw new AppError('Leave not found', 404);
  
  await verifySalonOwnership(leave.salonId.toString(), req.user!.id, req.user!.role);
  
  leave.status = req.body.status;
  leave.adminNotes = req.body.adminNotes;
  leave.approvedBy = req.user!.id as any;
  await leave.save();
  
  res.status(200).json({ success: true, data: leave });
});

// ==========================================
// EXCEPTIONS (FORCE OVERRIDES)
// ==========================================
export const createException = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.params.barberId as string;
  if (req.user!.role === UserRole.BARBER) throw new AppError('Only Salon Owners can create exceptions', 403);
  const barber = await verifyBarberAccess(barberId, req.user!.id, req.user!.role);
  
  const exception = await AvailabilityException.create({
    barberId,
    salonId: barber.salonId,
    createdBy: req.user!.id,
    ...req.body
  });
  
  res.status(201).json({ success: true, data: exception });
});
