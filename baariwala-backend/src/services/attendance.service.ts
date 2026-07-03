import { Attendance, AttendanceStatus } from '../models/Attendance';
import { AttendanceLog, LogType, CheckInMethod } from '../models/AttendanceLog';
import { ShiftAssignment } from '../models/ShiftAssignment';
import { WorkforceCalendar } from '../models/WorkforceCalendar';
import { AttendanceAudit, AttendanceAuditAction } from '../models/AttendanceAudit';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export class AttendanceService {
  /**
   * Helper to format YYYY-MM-DD
   */
  static getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Employee Check-In
   */
  static async checkIn(salonId: string, employeeId: string, method: CheckInMethod, location?: {lat: number, lng: number}) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const today = this.getTodayString();
      const now = new Date();
      
      // Get branchId from employee (Stubbed, assume from User model)
      // For now we assume branch is passed or derived, let's use a placeholder branchId for compilation
      const branchId = salonId; // Placeholder

      // Determine Shift
      const assignment = await ShiftAssignment.findOne({ employeeId, isActive: true }).session(session);
      const shiftId = assignment ? assignment.shiftId : undefined;

      // Upsert Attendance Record
      let attendance = await Attendance.findOne({ employeeId, date: today }).session(session);
      
      if (!attendance) {
        attendance = new Attendance({
          salonId,
          branchId,
          employeeId,
          date: today,
          shiftId,
          firstCheckIn: now,
          status: AttendanceStatus.FULL_DAY // Can be adjusted later based on logic
        });
      } else {
        if (!attendance.firstCheckIn) {
          attendance.firstCheckIn = now;
        }
      }
      
      await attendance.save({ session });

      // Create Log
      await AttendanceLog.create([{
        attendanceId: attendance._id,
        employeeId,
        type: LogType.CHECK_IN,
        timestamp: now,
        method,
        location
      }], { session });

      await session.commitTransaction();

      // Publish Event
      await EventBusService.publish('EmployeeCheckedIn', {
        employeeId,
        attendanceId: attendance._id,
        timestamp: now
      }, 'AttendanceEngine');

      return attendance;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Employee Check-Out
   */
  static async checkOut(employeeId: string, method: CheckInMethod) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const today = this.getTodayString();
      const now = new Date();
      
      const attendance = await Attendance.findOne({ employeeId, date: today }).session(session);
      if (!attendance || !attendance.firstCheckIn) {
        throw new AppError('No check-in found for today', 400);
      }
      
      attendance.lastCheckOut = now;
      
      // Calculate total work minutes for the day
      const diffMs = now.getTime() - attendance.firstCheckIn.getTime();
      attendance.totalWorkMinutes = Math.floor(diffMs / 60000) - attendance.totalBreakMinutes;

      // Adjust status based on hours
      if (attendance.totalWorkMinutes < 240) {
        attendance.status = AttendanceStatus.HALF_DAY;
      } else {
        attendance.status = AttendanceStatus.FULL_DAY;
      }

      await attendance.save({ session });

      // Create Log
      await AttendanceLog.create([{
        attendanceId: attendance._id,
        employeeId,
        type: LogType.CHECK_OUT,
        timestamp: now,
        method
      }], { session });

      await session.commitTransaction();

      // Publish Event
      await EventBusService.publish('EmployeeCheckedOut', {
        employeeId,
        attendanceId: attendance._id,
        timestamp: now,
        totalWorkMinutes: attendance.totalWorkMinutes
      }, 'AttendanceEngine');

      // Also publish AttendanceApproved assuming auto-approval for now
      // This will trigger Payroll accumulation
      await EventBusService.publish('AttendanceApproved', {
        employeeId,
        date: today,
        status: attendance.status
      }, 'AttendanceEngine');

      return attendance;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
