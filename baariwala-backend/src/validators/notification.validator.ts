import { z } from 'zod';

export const notificationSchemas = {
  updatePreferences: z.object({
    body: z.object({
      pushEnabled: z.boolean().optional(),
      emailEnabled: z.boolean().optional(),
      marketingEnabled: z.boolean().optional(),
      dndEnabled: z.boolean().optional(),
      dndStartHour: z.string().optional(),
      dndEndHour: z.string().optional(),
    }),
  }),
};
