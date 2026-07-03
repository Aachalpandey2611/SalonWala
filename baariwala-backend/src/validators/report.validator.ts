import { z } from 'zod';

export const reportSchemas = {
  requestReport: z.object({
    body: z.object({
      reportCode: z.string(),
      format: z.enum(['CSV', 'PDF', 'EXCEL']),
      parameters: z.object({
        startDate: z.string().datetime().optional(),
        endDate: z.string().datetime().optional()
      }).optional(),
      branchId: z.string().length(24).optional()
    })
  })
};
