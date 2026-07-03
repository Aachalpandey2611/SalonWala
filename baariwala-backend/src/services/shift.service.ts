import { AttendanceShift, ShiftType } from '../models/AttendanceShift';
import { ShiftAssignment } from '../models/ShiftAssignment';
import { WorkforceCalendar } from '../models/WorkforceCalendar';
import { AttendanceAudit, AttendanceAuditAction } from '../models/AttendanceAudit';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export class ShiftService {
  /**
   * Create a new shift configuration
   */
  static async createShift(salonId: string, branchId: string | undefined, payload: any) {
    const shift = await AttendanceShift.create({
      salonId,
      branchId,
      ...payload
    });
    return shift;
  }

  /**
   * Assign a shift to an employee
   */
  static async assignShift(salonId: string, employeeId: string, shiftId: string, startDate: Date, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const shift = await AttendanceShift.findOne({ _id: shiftId, salonId }).session(session);
      if (!shift) throw new AppError('Shift not found', 404);
      
      // Deactivate previous active assignment
      await ShiftAssignment.updateMany(
        { employeeId, isActive: true },
        { isActive: false, endDate: new Date() }
      ).session(session);
      
      const assignment = await ShiftAssignment.create([{
        salonId,
        employeeId,
        shiftId,
        startDate,
        isActive: true
      }], { session });

      await AttendanceAudit.create([{
        salonId,
        action: AttendanceAuditAction.SHIFT_ASSIGNED,
        performedBy: adminId,
        targetEmployeeId: employeeId,
        targetId: assignment[0]._id,
        details: { shiftId, startDate }
      }], { session });

      await session.commitTransaction();
      return assignment[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Rebuild Workforce Calendar for a branch for a given month
   * Normally done by a background CRON job
   */
  static async generateCalendarForMonth(salonId: string, branchId: string, year: number, month: number) {
    // simplified implementation placeholder
    return { success: true, message: `Calendar generated for ${year}-${month}` };
  }
}
