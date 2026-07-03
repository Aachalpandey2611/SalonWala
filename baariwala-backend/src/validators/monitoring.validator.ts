import { z } from 'zod';

export const monitoringSchemas = {
  resolveAlert: z.object({
    params: z.object({
      id: z.string()
    })
  })
};
