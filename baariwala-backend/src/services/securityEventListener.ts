import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';

export const setupSecurityEventListeners = () => {
  EventBusService.subscribe('AccountLocked', 'SecurityEngine', async (payload: any) => {
    logger.warn(`Security Engine: Account ${payload.userId} locked`);
  });
};
