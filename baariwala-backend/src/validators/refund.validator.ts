import { z } from 'zod';

export const refundSchemas = {
  processRefund: z.object({
    params: z.object({
      refundRequestId: z.string().min(1, 'Refund Request ID is required')
    })
  }),
  generateSettlement: z.object({
    body: z.object({
      periodStart: z.string().datetime(),
      periodEnd: z.string().datetime()
    })
  })
};
