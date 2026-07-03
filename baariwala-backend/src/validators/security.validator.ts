import { z } from 'zod';

export const securitySchemas = {
  blockIp: z.object({
    body: z.object({
      ipAddress: z.string(),
      reason: z.string()
    })
  })
};
