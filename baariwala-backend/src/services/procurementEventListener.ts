import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';

export const setupProcurementEventListeners = () => {
  // Listen for Low Stock events
  EventBusService.subscribe('InventoryLowStock', 'ProcurementEngine', async (payload: any) => {
    try {
      const { productId, branchId, currentStock } = payload;
      logger.info(`[ProcurementEngine] Low Stock Alert for Product ${productId} at Branch ${branchId}. Stock: ${currentStock}`);
      // Future logic: Auto-draft PO
    } catch (error) {
      logger.error(`[ProcurementEngine] Failed to process InventoryLowStock`, error);
    }
  });
};
