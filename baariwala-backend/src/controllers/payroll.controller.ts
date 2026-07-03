import { Request, Response } from 'express';
import { PayrollService } from '../services/payroll.service';
import { PayrollCycle } from '../models/PayrollCycle';
import { Payroll } from '../models/Payroll';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';
import { Payslip, PayslipStatus } from '../models/Payslip';
import { v4 as uuidv4 } from 'uuid';

export const createCycleController = catchAsync(async (req: Request, res: Response) => {
  const { name, cycleType, startDate, endDate } = req.body;
  const salonId = (req.user as any).salonId;
  const cycle = await PayrollService.createCycle(salonId, name, cycleType, new Date(startDate), new Date(endDate));
  res.status(201).json({ success: true, data: cycle });
});

export const getCyclesController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const cycles = await PayrollCycle.find({ salonId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: cycles });
});

export const generatePayrollController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // Cycle ID
  const { branchId } = req.body;
  const result = await PayrollService.generatePayroll(id as string, branchId, req.user!.id);
  res.status(200).json({ success: true, data: result });
});

export const approveCycleController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cycle = await PayrollService.approveCycle(id as string, req.user!.id);
  res.status(200).json({ success: true, data: cycle });
});

export const getPayrollsController = catchAsync(async (req: Request, res: Response) => {
  const { cycleId, employeeId } = req.query;
  const filter: any = {};
  
  if (req.user!.role === UserRole.BARBER) {
    filter.employeeId = req.user!.id;
  } else if (req.user!.role === UserRole.SALON_OWNER) {
    filter.salonId = (req.user as any).salonId;
  }
  
  if (cycleId) filter.cycleId = cycleId;
  if (employeeId && req.user!.role !== UserRole.BARBER) filter.employeeId = employeeId;
  
  const payrolls = await Payroll.find(filter).populate('employeeId', 'firstName lastName email').sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: payrolls });
});

export const adjustPayrollController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { type, amount, reason } = req.body;
  const payroll = await PayrollService.adjustPayroll(id as string, type, amount, reason, req.user!.id);
  res.status(200).json({ success: true, data: payroll });
});

export const generatePayslipController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // Payroll ID
  const payroll = await Payroll.findById(id).populate('employeeId', 'firstName lastName role').populate('cycleId');
  if (!payroll) throw new AppError('Payroll not found', 404);
  
  const existing = await Payslip.findOne({ payrollId: id });
  if (existing) return res.status(200).json({ success: true, data: existing });
  
  const cycle: any = payroll.cycleId;
  const employee: any = payroll.employeeId;
  
  const payslip = await Payslip.create({
    payrollId: payroll._id,
    payslipNumber: `PS-${uuidv4().split('-')[0].toUpperCase()}`,
    employeeDetails: {
      name: `${employee.firstName} ${employee.lastName}`,
      role: employee.role || 'Employee'
    },
    cycleDetails: {
      name: cycle.name,
      startDate: cycle.startDate,
      endDate: cycle.endDate
    },
    totals: {
      grossSalary: payroll.grossSalary,
      totalDeductions: payroll.totalDeductions,
      totalCommission: payroll.totalCommission,
      netSalary: payroll.netSalary
    },
    status: PayslipStatus.GENERATED
  });
  
  res.status(201).json({ success: true, data: payslip });
});
