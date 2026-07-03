import { z } from 'zod';

export const dashboardSchemas = {
  savePreferences: z.object({
    body: z.object({
      theme: z.string().optional(),
      refreshInterval: z.number().min(10).max(3600).optional()
    })
  })
};
