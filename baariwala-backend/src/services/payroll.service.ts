import mongoose from 'mongoose';
import { PayrollCycle, PayrollCycleStatus, PayrollCycleType } from '../models/PayrollCycle';
import { Payroll, PayrollType } from '../models/Payroll';
import { PayrollComponent, ComponentType } from '../models/PayrollComponent';
import { PayrollAdjustment, PayrollAdjustmentType } from '../models/PayrollAdjustment';
import { Payslip, PayslipStatus } from '../models/Payslip';
import { PayrollHistory } from '../models/PayrollHistory';
import { PayrollAudit, PayrollAuditAction } from '../models/PayrollAudit';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';
import { User } from '../models/User';

export class PayrollService {
  /**
   * Create a new Payroll Cycle
   */
  static async createCycle(salonId: string, name: string, cycleType: PayrollCycleType, startDate: Date, endDate: Date) {
    const cycle = await PayrollCycle.create({
      salonId,
      name,
      cycleType,
      startDate,
      endDate
    });
    return cycle;
  }

  /**
   * Calculate/Generate Payroll for all employees in a cycle/branch
   * Note: In a true enterprise system, this would be a background job (BullMQ). 
   * Here we do a synchronous batched approach for simplicity.
   */
  static async generatePayroll(cycleId: string, branchId: string, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const cycle = await PayrollCycle.findById(cycleId).session(session);
      if (!cycle) throw new AppError('Cycle not found', 404);
      if (cycle.status !== PayrollCycleStatus.DRAFT) {
        throw new AppError('Can only generate payroll for DRAFT cycles', 400);
      }

      cycle.status = PayrollCycleStatus.PROCESSING;
      await cycle.save({ session });

      // Fetch employees in branch (Assumption: User model has branchId/salonId and role BARBER/MANAGER)
      // For this implementation, we assume we fetch all users that belong to this branch
      const employees = await User.find({ salonId: cycle.salonId }).session(session); 
      // In real app, filter by branchId.

      // Fetch components
      const components = await PayrollComponent.find({ salonId: cycle.salonId, isActive: true }).session(session);
      const earnings = components.filter(c => c.type === ComponentType.EARNING);
      const deductions = components.filter(c => c.type === ComponentType.DEDUCTION);

      const payrolls = [];

      for (const emp of employees) {
        // Skip if payroll already exists
        const existing = await Payroll.findOne({ cycleId, employeeId: emp._id }).session(session);
        if (existing) continue;

        // Base calculations (Stubbed for now, normally fetched from Employee contract)
        let grossSalary = 1000; 
        let totalDeductions = 100;
        
        // Example: Add fixed components
        const componentEntries = [
          ...earnings.map(e => ({ componentId: e._id as mongoose.Types.ObjectId, amount: 500 })),
          ...deductions.map(d => ({ componentId: d._id as mongoose.Types.ObjectId, amount: 50 }))
        ];

        grossSalary = componentEntries.filter(c => earnings.find(e => e._id.equals(c.componentId))).reduce((a, b) => a + b.amount, 0);
        totalDeductions = componentEntries.filter(c => deductions.find(e => e._id.equals(c.componentId))).reduce((a, b) => a + b.amount, 0);

        const payroll = new Payroll({
          salonId: cycle.salonId,
          branchId,
          employeeId: emp._id,
          cycleId,
          payrollType: PayrollType.MONTHLY,
          components: componentEntries,
          grossSalary,
          totalDeductions,
          totalCommission: 0, // Commission is added via EventBus
          netSalary: grossSalary - totalDeductions,
          status: PayrollCycleStatus.PROCESSING
        });

        await payroll.save({ session });
        payrolls.push(payroll);
      }

      await PayrollAudit.create([{
        salonId: cycle.salonId,
        action: PayrollAuditAction.GENERATED,
        performedBy: adminId,
        targetId: cycle._id,
        details: { employeeCount: payrolls.length }
      }], { session });

      await session.commitTransaction();
      
      // Publish event
      await EventBusService.publish('PayrollGenerated', { cycleId, branchId, count: payrolls.length }, 'PayrollEngine');
      
      return { cycle, generatedCount: payrolls.length };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Approve a Payroll Cycle
   */
  static async approveCycle(cycleId: string, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const cycle = await PayrollCycle.findById(cycleId).session(session);
      if (!cycle) throw new AppError('Not found', 404);
      if (cycle.status !== PayrollCycleStatus.PROCESSING) throw new AppError('Cycle must be in PROCESSING to approve', 400);

      cycle.status = PayrollCycleStatus.APPROVED;
      cycle.approvalDate = new Date();
      await cycle.save({ session });

      await Payroll.updateMany({ cycleId }, { status: PayrollCycleStatus.APPROVED }).session(session);

      await PayrollAudit.create([{
        salonId: cycle.salonId,
        action: PayrollAuditAction.APPROVED,
        performedBy: adminId,
        targetId: cycle._id,
        details: {}
      }], { session });

      await session.commitTransaction();
      await EventBusService.publish('PayrollApproved', { cycleId }, 'PayrollEngine');
      return cycle;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Adjust individual payroll
   */
  static async adjustPayroll(payrollId: string, type: PayrollAdjustmentType, amount: number, reason: string, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const payroll = await Payroll.findById(payrollId).session(session);
      if (!payroll) throw new AppError('Payroll not found', 404);
      if (payroll.status === PayrollCycleStatus.PAID || payroll.status === PayrollCycleStatus.LOCKED) {
        throw new AppError('Cannot adjust finalized payroll', 400);
      }

      await PayrollAdjustment.create([{
        payrollId,
        type,
        amount,
        reason,
        adjustedBy: adminId
      }], { session });

      // Recalculate Net
      if (type === PayrollAdjustmentType.BONUS || type === PayrollAdjustmentType.INCENTIVE) {
        payroll.netSalary += amount;
        payroll.grossSalary += amount; // Treat as gross addition
      } else {
        payroll.netSalary -= amount;
        payroll.totalDeductions += amount;
      }

      await payroll.save({ session });

      await PayrollAudit.create([{
        salonId: payroll.salonId,
        action: PayrollAuditAction.MANUAL_ADJUSTMENT,
        performedBy: adminId,
        targetId: payroll._id,
        details: { type, amount, reason }
      }], { session });

      await session.commitTransaction();
      return payroll;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
