import { z } from 'zod';
import { ShiftType } from '../models/AttendanceShift';
import { CheckInMethod } from '../models/AttendanceLog';
import { LeaveType } from '../models/LeaveBalance';

export const attendanceSchemas = {
  createShift: z.object({
    body: z.object({
      name: z.string().min(3),
      shiftType: z.nativeEnum(ShiftType),
      startTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
      endTime: z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
      gracePeriodMinutes: z.number().optional(),
      halfDayThresholdMinutes: z.number().optional(),
      totalBreakMinutes: z.number().optional()
    })
  }),
  
  assignShift: z.object({
    body: z.object({
      employeeId: z.string().length(24),
      shiftId: z.string().length(24),
      startDate: z.string().datetime()
    })
  }),
  
  checkIn: z.object({
    body: z.object({
      method: z.nativeEnum(CheckInMethod),
      location: z.object({
        lat: z.number(),
        lng: z.number()
      }).optional()
    })
  }),
  
  checkOut: z.object({
    body: z.object({
      method: z.nativeEnum(CheckInMethod)
    })
  }),
  
  applyLeave: z.object({
    body: z.object({
      leaveType: z.nativeEnum(LeaveType),
      startDate: z.string(), // YYYY-MM-DD
      endDate: z.string(), // YYYY-MM-DD
      totalDays: z.number().positive(),
      reason: z.string().min(5)
    })
  })
};
