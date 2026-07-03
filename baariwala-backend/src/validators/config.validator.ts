import { z } from 'zod';
import { SettingLevel } from '../models/PlatformSetting';

export const configSchemas = {
  createSetting: z.object({
    body: z.object({
      key: z.string(),
      value: z.any(),
      type: z.enum(['string', 'number', 'boolean', 'json']),
      level: z.enum([SettingLevel.GLOBAL, SettingLevel.TENANT, SettingLevel.BRANCH]),
      tenantId: z.string().optional(),
      branchId: z.string().optional()
    })
  })
};
