import { EventBusService } from './eventBus.service';
import { InventoryService } from './inventory.service';
import { logger } from '../utils/logger';
import { User } from '../models/User';
import { UserRole } from '../constants/roles';

export function initializeInventoryEventListeners() {
  EventBusService.subscribe('AppointmentCompleted', 'InventoryEngine', async (payload: any) => {
    try {
      const { appointmentId, serviceIds, salonId } = payload;
      logger.info(`[InventoryEventListener] Processing Auto-Consumption for Appointment ${appointmentId}`);
      
      // We need a system admin ID to record the automated deduction
      // We will fall back to the first super admin found if not passed
      let systemAdminId = payload.systemAdminId;
      if (!systemAdminId) {
        const superAdmin = await User.findOne({ role: UserRole.SUPER_ADMIN }).select('_id');
        systemAdminId = superAdmin ? superAdmin._id.toString() : null;
      }
      
      if (!systemAdminId) {
        throw new Error('No SUPER_ADMIN found to initiate system inventory movement');
      }
      
      await InventoryService.processServiceConsumption(
        appointmentId,
        serviceIds,
        salonId, // Assuming salonId acts as branchId for now
        systemAdminId
      );
      
      logger.info(`[InventoryEventListener] Auto-Consumption successful for Appointment ${appointmentId}`);
    } catch (error) {
      logger.error(`[InventoryEventListener] Failed to process auto-consumption`, error);
    }
  });
}
