import { z } from 'zod';
import { SubscriptionPlan } from '../models/TenantSubscription';

export const tenantSchemas = {
  createTenant: z.object({
    body: z.object({
      tenantName: z.string().min(2),
      email: z.string().email(),
      plan: z.enum([SubscriptionPlan.FREE_TRIAL, SubscriptionPlan.STARTER, SubscriptionPlan.PROFESSIONAL, SubscriptionPlan.ENTERPRISE])
    })
  })
};
