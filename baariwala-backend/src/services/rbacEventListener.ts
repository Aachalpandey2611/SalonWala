import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { RBACService } from './rbac.service';

export const setupRBACEventListeners = () => {
  
  // When a Role is updated, we must invalidate cache for all users holding that role.
  // In a real system, we'd query UserRole to find specific users, but for now we listen for specific invalidation events.
  EventBusService.subscribe('RoleUpdated', 'RBACEngine', async (payload: any) => {
    try {
      const { userIds } = payload; // The users holding this role
      
      if (userIds && Array.isArray(userIds)) {
        await Promise.all(userIds.map(id => RBACService.invalidateUserCache(id)));
        logger.info(`[RBACEngine] Invalidated Permission Cache for ${userIds.length} users`);
      }
      
    } catch (error) {
      logger.error(`[RBACEngine] Role cache invalidation failed`, error);
    }
  });

};
