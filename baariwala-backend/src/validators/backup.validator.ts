import { z } from 'zod';
import { BackupType } from '../models/BackupConfiguration';

export const backupSchemas = {
  triggerBackup: z.object({
    body: z.object({
      type: z.nativeEnum(BackupType)
    })
  }),
  triggerRestore: z.object({
    body: z.object({
      backupJobId: z.string(),
      targetTenantId: z.string().optional()
    })
  })
};
