import { z } from 'zod';
import { QueuePriority } from '../models/QueueEntry';

export const queueSchemas = {
  joinQueue: z.object({
    body: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      branchId: z.string().min(1, 'Branch ID is required'),
      barberId: z.string().min(1, 'Barber ID is required'),
      customerId: z.string().optional(),
      appointmentId: z.string().optional(),
      source: z.enum(['APP', 'WALK_IN', 'ADMIN']),
      priorityLevel: z.nativeEnum(QueuePriority).optional(),
    }),
  }),
};
