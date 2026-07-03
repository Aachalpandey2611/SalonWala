import { z } from 'zod';

export const analyticsSchemas = {
  getDateRange: z.object({
    query: z.object({
      startDate: z.string().datetime().optional(),
      endDate: z.string().datetime().optional(),
      branchId: z.string().length(24).optional()
    })
  })
};
