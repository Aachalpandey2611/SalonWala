import { LeaveRequest, LeaveStatus } from '../models/LeaveRequest';
import { LeaveBalance, LeaveType } from '../models/LeaveBalance';
import { WorkforceCalendar } from '../models/WorkforceCalendar';
import { AttendanceAudit, AttendanceAuditAction } from '../models/AttendanceAudit';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export class LeaveService {
  /**
   * Apply for leave
   */
  static async applyLeave(salonId: string, employeeId: string, leaveType: LeaveType, startDate: string, endDate: string, totalDays: number, reason: string) {
    // Basic validation
    if (new Date(startDate) > new Date(endDate)) throw new AppError('Invalid date range', 400);

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Check Balance
      const year = new Date(startDate).getFullYear();
      const balanceDoc = await LeaveBalance.findOne({ employeeId, leaveType, year }).session(session);
      
      // If it's a constrained leave type, check limits
      if (leaveType !== LeaveType.UNPAID && leaveType !== LeaveType.COMPENSATORY) {
        if (!balanceDoc || balanceDoc.balance < totalDays) {
          throw new AppError(`Insufficient balance for ${leaveType}`, 400);
        }
      }

      const request = await LeaveRequest.create([{
        salonId,
        employeeId,
        leaveType,
        startDate,
        endDate,
        totalDays,
        reason,
        status: LeaveStatus.PENDING
      }], { session });

      await session.commitTransaction();
      return request[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Approve Leave
   */
  static async approveLeave(requestId: string, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const request = await LeaveRequest.findById(requestId).session(session);
      if (!request) throw new AppError('Leave request not found', 404);
      if (request.status !== LeaveStatus.PENDING) throw new AppError('Only pending requests can be approved', 400);
      
      request.status = LeaveStatus.APPROVED;
      request.approvedBy = adminId as any;
      await request.save({ session });
      
      // Deduct Balance
      const year = new Date(request.startDate).getFullYear();
      const balanceDoc = await LeaveBalance.findOne({ employeeId: request.employeeId, leaveType: request.leaveType, year }).session(session);
      if (balanceDoc) {
        balanceDoc.used += request.totalDays;
        balanceDoc.balance -= request.totalDays;
        await balanceDoc.save({ session });
      }

      // Mark in calendar
      await WorkforceCalendar.updateMany(
        { 
          employeeId: request.employeeId,
          date: { $gte: request.startDate, $lte: request.endDate }
        },
        { 
          isOnLeave: true, 
          leaveId: request._id 
        }
      ).session(session);

      await AttendanceAudit.create([{
        salonId: request.salonId,
        action: AttendanceAuditAction.LEAVE_APPROVED,
        performedBy: adminId,
        targetEmployeeId: request.employeeId,
        targetId: request._id,
        details: { leaveType: request.leaveType, days: request.totalDays }
      }], { session });

      await session.commitTransaction();

      // Publish
      await EventBusService.publish('LeaveApproved', {
        leaveId: request._id,
        employeeId: request.employeeId,
        totalDays: request.totalDays
      }, 'AttendanceEngine');

      return request;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
