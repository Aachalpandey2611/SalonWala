import { z } from 'zod';

export const lifecycleSchemas = {
  checkIn: z.object({
    body: z.object({
      method: z.enum(['QR', 'OTP', 'MANUAL', 'WALK_IN']),
    }),
  }),
  
  assignBarber: z.object({
    body: z.object({
      barberId: z.string().min(1, 'Barber ID is required'),
    }),
  }),
  
  completeService: z.object({
    body: z.object({
      notes: z.string().max(1000).optional().default(''),
    }),
  }),
  
  cancelBooking: z.object({
    body: z.object({
      reason: z.string().min(1, 'Reason is required').max(500),
    }),
  }),
};
