import { z } from 'zod';

export const walletSchemas = {
  rechargeWallet: z.object({
    body: z.object({
      amount: z.number().positive('Amount must be positive')
    })
  }),
  
  payUsingWallet: z.object({
    body: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      amount: z.number().positive('Amount must be positive'),
      referenceId: z.string().min(1, 'Reference ID (Booking ID) is required')
    })
  })
};
