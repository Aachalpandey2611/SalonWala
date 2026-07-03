import { z } from 'zod';

export const recommendationSchemas = {
  recommendBarber: z.object({
    query: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      customerId: z.string().optional(),
    }),
  }),
  
  recommendService: z.object({
    query: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      serviceId: z.string().min(1, 'Primary Service ID is required'),
      customerId: z.string().optional(),
    }),
  }),
  
  recommendSlot: z.object({
    query: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      barberId: z.string().min(1, 'Barber ID is required'),
      date: z.string().min(1, 'Date is required (YYYY-MM-DD)'),
    }),
  }),
  
  recommendRecovery: z.object({
    query: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
    }),
  }),
};
