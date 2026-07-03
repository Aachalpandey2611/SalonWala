import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import { BackupService } from './backup.service';
import { BackupType } from '../models/BackupConfiguration';

export const setupBackupEventListeners = () => {
  // If a critical configuration changes, trigger an automated differential backup
  EventBusService.subscribe('ConfigurationUpdated', 'BackupEngine', async () => {
    logger.info('Configuration update detected, triggering config backup...');
    await BackupService.triggerBackup(BackupType.CONFIG);
  });
};
