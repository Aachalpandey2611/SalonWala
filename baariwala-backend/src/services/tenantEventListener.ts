import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { TenantService } from './tenant.service';
import { TenantSubscription } from '../models/TenantSubscription';

export const setupTenantEventListeners = () => {
  
  // Example: When a new branch is created via SalonService, we increment the tenant's usage limit tracker
  EventBusService.subscribe('BranchCreated', 'TenantEngine', async (payload: any) => {
    try {
      const { tenantId, branchId } = payload;
      
      if (!tenantId) return; // Legacy branches won't have tenantId until migrated
      
      await TenantSubscription.findOneAndUpdate(
        { tenantId },
        { $inc: { 'currentUsage.activeBranches': 1 } }
      );
      
      logger.info(`[TenantEngine] Incremented Branch Usage for Tenant ${tenantId}`);
    } catch (error) {
      logger.error(`[TenantEngine] BranchCreated tracking failed`, error);
    }
  });

};
