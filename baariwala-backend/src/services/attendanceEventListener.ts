import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';

export const setupAttendanceEventListeners = () => {
  // Listen for Identity module creating a new Employee
  EventBusService.subscribe('EmployeeCreated', 'AttendanceEngine', async (payload: any) => {
    try {
      const { employeeId, salonId } = payload;
      logger.info(`[AttendanceEngine] Initializing default leave balance and shifts for new employee ${employeeId}`);
      // Future logic: Create default LeaveBalances here
    } catch (error) {
      logger.error(`[AttendanceEngine] Failed to process EmployeeCreated`, error);
    }
  });
  
  // Future: BranchChanged -> unassign active shift
};
