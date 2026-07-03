import { z } from 'zod';
import { DayOfWeek } from '../models/BusinessHours';
import { ShiftType } from '../models/BarberShift';
import { BreakType } from '../models/BarberBreak';
import { LeaveType, LeaveStatus } from '../models/BarberLeave';
import { ExceptionType } from '../models/AvailabilityException';

export const availabilitySchemas = {
  // WORKING HOURS
  setWorkingHours: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      branchId: z.string().min(1),
      day: z.nativeEnum(DayOfWeek),
      isOff: z.boolean().default(false),
      sessions: z.array(z.object({
        startTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid HH:MM'),
        endTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid HH:MM'),
      })).optional(),
    }),
  }),

  // SHIFTS
  createShift: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      branchId: z.string().min(1),
      type: z.nativeEnum(ShiftType),
      effectiveDate: z.string().optional(),
      expiryDate: z.string().optional(),
      sessions: z.array(z.object({
        startTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
        endTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
      })).min(1, 'At least one session is required'),
      notes: z.string().max(500).optional(),
    }),
  }),

  // BREAKS
  createBreak: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      branchId: z.string().min(1),
      type: z.nativeEnum(BreakType),
      isRecurring: z.boolean().default(false),
      date: z.string().optional(),
      startTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
      endTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/),
      durationInMinutes: z.number().int().min(1),
      notes: z.string().max(500).optional(),
    }).refine(data => data.isRecurring || data.date, {
      message: 'Date is required for non-recurring breaks',
      path: ['date'],
    }),
  }),

  // LEAVES
  requestLeave: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      type: z.nativeEnum(LeaveType),
      startDate: z.string(),
      endDate: z.string(),
      durationInDays: z.number().min(0.5),
      reason: z.string().min(5),
      halfDayStartTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/).optional(),
      halfDayEndTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/).optional(),
    }),
  }),

  updateLeaveStatus: z.object({
    params: z.object({ id: z.string() }), // leave ID
    body: z.object({
      status: z.nativeEnum(LeaveStatus),
      adminNotes: z.string().max(500).optional(),
    }),
  }),

  // EXCEPTIONS
  createException: z.object({
    params: z.object({ barberId: z.string() }),
    body: z.object({
      branchId: z.string().optional(), // Nullable if globally forcing unavailable
      type: z.nativeEnum(ExceptionType),
      startTime: z.string(),
      endTime: z.string(),
      reason: z.string().min(5),
    }),
  }),

  // SLOT ENGINE
  generateSlots: z.object({
    query: z.object({
      barberId: z.string().min(1),
      date: z.string(), // YYYY-MM-DD
      slotDurationInMinutes: z.string().regex(/^\d+$/).default('15'), // e.g. '15'
    }),
  }),
  
  checkAvailability: z.object({
    query: z.object({
      barberId: z.string().min(1),
      date: z.string(),
      serviceId: z.string().min(1), // Used for buffer/duration calculation
    }),
  }),
};
