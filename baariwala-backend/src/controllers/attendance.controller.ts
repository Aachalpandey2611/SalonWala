import { Request, Response } from 'express';
import { ShiftService } from '../services/shift.service';
import { LeaveService } from '../services/leave.service';
import { AttendanceService } from '../services/attendance.service';
import { AttendanceShift } from '../models/AttendanceShift';
import { LeaveRequest } from '../models/LeaveRequest';
import { LeaveBalance } from '../models/LeaveBalance';
import { Attendance } from '../models/Attendance';
import { catchAsync } from '../utils/catchAsync';

/**
 * SHIFT CONTROLLERS
 */
export const createShiftController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const branchId = req.body.branchId; // optional
  const shift = await ShiftService.createShift(salonId, branchId, req.body);
  res.status(201).json({ success: true, data: shift });
});

export const getShiftsController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const shifts = await AttendanceShift.find({ salonId, isActive: true });
  res.status(200).json({ success: true, data: shifts });
});

export const assignShiftController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { employeeId, shiftId, startDate } = req.body;
  const assignment = await ShiftService.assignShift(salonId, employeeId, shiftId, new Date(startDate), req.user!.id);
  res.status(200).json({ success: true, data: assignment });
});

/**
 * ATTENDANCE CONTROLLERS
 */
export const checkInController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { method, location } = req.body;
  const attendance = await AttendanceService.checkIn(salonId, req.user!.id, method, location);
  res.status(200).json({ success: true, data: attendance });
});

export const checkOutController = catchAsync(async (req: Request, res: Response) => {
  const { method } = req.body;
  const attendance = await AttendanceService.checkOut(req.user!.id, method);
  res.status(200).json({ success: true, data: attendance });
});

export const getAttendanceController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role === 'Barber') filter.employeeId = req.user!.id;
  else filter.salonId = (req.user as any).salonId;
  
  const attendances = await Attendance.find(filter).sort({ date: -1, createdAt: -1 }).limit(100);
  res.status(200).json({ success: true, data: attendances });
});

/**
 * LEAVE CONTROLLERS
 */
export const applyLeaveController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { leaveType, startDate, endDate, totalDays, reason } = req.body;
  const request = await LeaveService.applyLeave(salonId, req.user!.id, leaveType, startDate, endDate, totalDays, reason);
  res.status(201).json({ success: true, data: request });
});

export const approveLeaveController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const request = await LeaveService.approveLeave(id as string, req.user!.id);
  res.status(200).json({ success: true, data: request });
});

export const getLeaveRequestsController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role === 'Barber') filter.employeeId = req.user!.id;
  else filter.salonId = (req.user as any).salonId;
  
  const requests = await LeaveRequest.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: requests });
});

export const getLeaveBalanceController = catchAsync(async (req: Request, res: Response) => {
  const year = new Date().getFullYear();
  const balances = await LeaveBalance.find({ employeeId: req.user!.id, year });
  res.status(200).json({ success: true, data: balances });
});
