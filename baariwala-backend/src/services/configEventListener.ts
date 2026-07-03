import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';

export const setupConfigEventListeners = () => {
  
  // Wipe caches globally on massive platform changes
  EventBusService.subscribe('ConfigurationUpdated', 'ConfigEngine', async (payload: any) => {
    try {
      if (redisClient) {
        // In a real prod setup we'd be more granular, but for demonstration we flush config prefix
        const keys = await redisClient.keys('config:*');
        if (keys.length) await redisClient.del(keys);
        
        logger.info(`[ConfigEngine] Invalidated Configuration Caches on Update`);
      }
    } catch (error) {
      logger.error('ConfigEngine cache invalidation failed', error);
    }
  });

};
