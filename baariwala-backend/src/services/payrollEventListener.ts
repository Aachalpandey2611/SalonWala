import { EventBusService } from './eventBus.service';
import { Payroll } from '../models/Payroll';
import { PayrollCycleStatus } from '../models/PayrollCycle';
import { logger } from '../utils/logger';

export const setupPayrollEventListeners = () => {
  // Listen for Commission Approved to add to Payroll
  EventBusService.subscribe('CommissionCreated', 'PayrollEngine', async (payload: any) => {
    try {
      const { commissionId, recipientId, amount, salonId } = payload;
      if (!commissionId || !recipientId || !amount) return;

      // Find an active DRAFT or PROCESSING payroll for this employee
      const payroll = await Payroll.findOne({
        employeeId: recipientId,
        salonId,
        status: { $in: [PayrollCycleStatus.DRAFT, PayrollCycleStatus.PROCESSING] }
      });

      if (payroll) {
        payroll.totalCommission += amount;
        payroll.netSalary += amount;
        await payroll.save();
        logger.info(`[PayrollEngine] Commission of ${amount} added to Payroll ${payroll._id}`);
      }
    } catch (error) {
      logger.error(`[PayrollEngine] Failed to process CommissionCreated`, error);
    }
  });
  
  // Future: AttendanceApproved, LeaveApproved, etc.
};
