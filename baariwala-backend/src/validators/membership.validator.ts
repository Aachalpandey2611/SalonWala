import { z } from 'zod';

export const membershipSchemas = {
  purchaseMembership: z.object({
    body: z.object({
      planId: z.string().min(1, 'Plan ID is required')
    })
  }),
  upgradeMembership: z.object({
    body: z.object({
      newPlanId: z.string().min(1, 'New Plan ID is required')
    })
  })
};
