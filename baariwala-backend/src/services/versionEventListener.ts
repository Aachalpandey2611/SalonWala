import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { redisClient } from '../config/redis';

export const setupVersionEventListeners = () => {
  EventBusService.subscribe('ApiVersionUpdated', 'VersionEngine', async (payload: any) => {
    // Flush version cache
    if (redisClient) {
      await redisClient.del(`api_version:${payload.version}`);
      logger.info(`Version Cache flushed for ${payload.version}`);
    }
  });

  EventBusService.subscribe('ClientCompatUpdated', 'VersionEngine', async (payload: any) => {
    // Flush client cache
    if (redisClient) {
      await redisClient.del(`client_compat:${payload.platform}`);
      logger.info(`Client Compat Cache flushed for ${payload.platform}`);
    }
  });
};
