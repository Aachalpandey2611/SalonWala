import { z } from 'zod';

export const validationSchemas = {
  validateBooking: z.object({
    body: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      branchId: z.string().min(1, 'Branch ID is required'),
      barberId: z.string().min(1, 'Barber ID is required'),
      customerId: z.string().min(1, 'Customer ID is required'),
      
      primaryServiceId: z.string().min(1, 'Primary Service ID is required'),
      selectedAddons: z.array(z.string()).default([]),
      
      appointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
      appointmentStartTime: z.string().regex(/^([0-1]\d|2[0-3]):([0-5]\d)$/, 'Invalid HH:MM time format'),
    }),
  }),
};
