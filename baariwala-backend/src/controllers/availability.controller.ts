import { Request, Response } from 'express';
import { BarberWorkingHours } from '../models/BarberWorkingHours';
import { BarberBreak } from '../models/BarberBreak';
import { BarberLeave, LeaveStatus } from '../models/BarberLeave';
import { AvailabilityException, ExceptionType } from '../models/AvailabilityException';
import { TimeSlot, SlotStatus } from '../models/TimeSlot';
import { Holiday } from '../models/Holiday'; // Inherit from Salon Management
import { SalonService } from '../models/SalonService';
import { Barber } from '../models/Barber';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

// Helper to get day name
const getDayName = (date: Date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

// ==========================================
// SLOT GENERATION ENGINE
// ==========================================
export const generateSlots = catchAsync(async (req: Request, res: Response) => {
  const barberId = req.query.barberId as string;
  const dateStr = req.query.date as string;
  const slotDurationInMinutes = parseInt(req.query.slotDurationInMinutes as string) || 15;
  
  const targetDate = new Date(dateStr);
  const dayOfWeek = getDayName(targetDate);
  
  const barber = await Barber.findById(barberId);
  if (!barber) throw new AppError('Barber not found', 404);

  // 1. Check Salon Holidays (Inheritance)
  const holiday = await Holiday.findOne({
    salonId: barber.salonId,
    $or: [{ branchId: barber.defaultBranchId }, { branchId: { $exists: false } }],
    date: dateStr // Assuming date matches YYYY-MM-DD
  });
  if (holiday) {
    return res.status(200).json({ success: true, data: [], message: 'Salon is closed on this date' });
  }

  // 2. Check Approved Full-Day Leaves
  const leave = await BarberLeave.findOne({
    barberId,
    status: LeaveStatus.APPROVED,
    startDate: { $lte: targetDate },
    endDate: { $gte: targetDate }
  });
  if (leave && leave.durationInDays >= 1) {
    return res.status(200).json({ success: true, data: [], message: 'Barber is on leave' });
  }

  // 3. Check Global Availability Exceptions (Force Unavailable)
  const exception = await AvailabilityException.findOne({
    barberId,
    type: ExceptionType.FORCE_UNAVAILABLE,
    startTime: { $lte: targetDate }, // Simplified check
    endTime: { $gte: targetDate }
  });
  if (exception) {
    return res.status(200).json({ success: true, data: [], message: 'Barber is forcefully unavailable' });
  }

  // 4. Fetch Working Hours
  const workingHours = await BarberWorkingHours.findOne({
    barberId,
    day: dayOfWeek as any,
    isOff: false
  });
  if (!workingHours || workingHours.sessions.length === 0) {
    return res.status(200).json({ success: true, data: [], message: 'Barber is off on this day' });
  }

  // 5. Fetch Booked/Locked Slots
  const existingSlots = await TimeSlot.find({
    barberId,
    date: targetDate,
    status: { $in: [SlotStatus.BOOKED, SlotStatus.LOCKED, SlotStatus.BLOCKED] }
  });
  const bookedSet = new Set(existingSlots.map(s => s.startTime));

  // 6. Generate Time Slots
  const availableSlots: string[] = [];
  
  workingHours.sessions.forEach(session => {
    const [currentHour, currentMin] = session.startTime.split(':').map(Number);
    const [endHour, endMin] = session.endTime.split(':').map(Number);
    
    let currentTotalMinutes = currentHour * 60 + currentMin;
    const endTotalMinutes = endHour * 60 + endMin;
    
    while (currentTotalMinutes + slotDurationInMinutes <= endTotalMinutes) {
      const h = Math.floor(currentTotalMinutes / 60).toString().padStart(2, '0');
      const m = (currentTotalMinutes % 60).toString().padStart(2, '0');
      const timeStr = `${h}:${m}`;
      
      // If not already booked, add to available
      if (!bookedSet.has(timeStr)) {
        availableSlots.push(timeStr);
      }
      
      currentTotalMinutes += slotDurationInMinutes;
    }
  });
  
  // Note: Filtering out breaks and half-day leaves requires similar intersection logic against `timeStr`.
  // For production, we'd add complex intersection checks here.

  res.status(200).json({
    success: true,
    data: availableSlots,
    meta: {
      date: dateStr,
      day: dayOfWeek,
      slotDuration: slotDurationInMinutes
    }
  });
});

// ==========================================
// CHECK SPECIFIC AVAILABILITY & BUFFER
// ==========================================
export const checkAvailability = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.query.serviceId as string;
  // const barberId = req.query.barberId as string;
  // const dateStr = req.query.date as string;
  
  const service = await SalonService.findById(serviceId);
  if (!service) throw new AppError('Service not found', 404);
  
  // Buffer Calculation
  const requiredDuration = service.totalCalculatedDuration;
  
  // A real engine would check if there are `N` consecutive slots available on `dateStr` 
  // equal to `requiredDuration`.
  
  res.status(200).json({
    success: true,
    message: `Checking availability for ${requiredDuration} minutes...`,
    data: {
      requiredDuration,
      isAvailable: true // Mocked for architecture response
    }
  });
});
