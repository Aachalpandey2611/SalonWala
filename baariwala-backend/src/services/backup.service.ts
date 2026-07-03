import { BackupJob, BackupStatus } from '../models/BackupJob';
import { RestoreJob, RestoreStatus } from '../models/RestoreJob';
import { BackupType } from '../models/BackupConfiguration';
import { EventBusService } from './eventBus.service';
import { logger } from '../utils/logger';
import crypto from 'crypto';

export class BackupService {
  
  /**
   * Triggers a manual or automated backup
   */
  static async triggerBackup(type: BackupType) {
    const job = await BackupJob.create({
      type,
      status: BackupStatus.IN_PROGRESS
    });
    
    await EventBusService.publish('BackupStarted', { jobId: job._id, type }, 'BackupService');
    
    try {
      // Simulate backup process
      const fakeSize = Math.floor(Math.random() * 500) + 50; // 50-550MB
      const checksum = crypto.randomBytes(16).toString('hex');
      
      job.status = BackupStatus.COMPLETED;
      job.fileSizeMb = fakeSize;
      job.checksum = checksum;
      job.storageUrl = `s3://SalonWala-backups/${type.toLowerCase()}-${job._id}.tar.gz`;
      job.completedAt = new Date();
      
      await job.save();
      
      await EventBusService.publish('BackupCompleted', { jobId: job._id, type }, 'BackupService');
      logger.info(`[BACKUP] Successfully completed ${type} backup. Size: ${fakeSize}MB`);
      
    } catch (error: any) {
      job.status = BackupStatus.FAILED;
      job.error = error.message;
      await job.save();
      
      await EventBusService.publish('BackupFailed', { jobId: job._id, type, error: error.message }, 'BackupService');
      logger.error(`[BACKUP] Failed ${type} backup`, error);
    }
    
    return job;
  }

  /**
   * Initiates a Point-in-Time Restore
   */
  static async triggerRestore(backupJobId: string, requestedBy: string, targetTenantId?: string) {
    const backup = await BackupJob.findById(backupJobId);
    if (!backup || backup.status !== BackupStatus.COMPLETED) {
      throw new Error('Invalid or incomplete backup job');
    }
    
    const restore = await RestoreJob.create({
      backupJobId,
      type: backup.type,
      requestedBy,
      targetTenantId,
      status: RestoreStatus.IN_PROGRESS,
      startedAt: new Date()
    });
    
    await EventBusService.publish('RestoreStarted', { restoreId: restore._id, type: backup.type }, 'BackupService');
    
    try {
      // Simulate restore processing
      restore.status = RestoreStatus.COMPLETED;
      restore.completedAt = new Date();
      await restore.save();
      
      await EventBusService.publish('RestoreCompleted', { restoreId: restore._id, type: backup.type }, 'BackupService');
      logger.info(`[RESTORE] Successfully restored ${backup.type} from job ${backupJobId}`);
      
    } catch (error: any) {
      restore.status = RestoreStatus.FAILED;
      restore.error = error.message;
      await restore.save();
    }
    
    return restore;
  }
}
