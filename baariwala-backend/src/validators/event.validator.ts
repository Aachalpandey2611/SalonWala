import { z } from 'zod';

export const eventSchemas = {
  publishEvent: z.object({
    body: z.object({
      eventType: z.string().min(1, 'Event Type is required'),
      producer: z.string().min(1, 'Producer is required'),
      payload: z.any(), // JSON object
      correlationId: z.string().optional(),
    }),
  }),
};
