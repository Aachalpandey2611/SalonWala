import { z } from 'zod';

export const auditSchemas = {
  getLogs: z.object({
    query: z.object({
      module: z.string().optional(),
      action: z.string().optional(),
      page: z.string().optional(),
      limit: z.string().optional()
    })
  })
};
