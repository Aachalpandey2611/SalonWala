import { z } from 'zod';
import { CommissionStatus } from '../models/Commission';
import { AdjustmentType } from '../models/CommissionAdjustment';
import { CommissionRuleType, CommissionTargetType } from '../models/CommissionRule';

export const commissionSchemas = {
  changeStatus: z.object({
    body: z.object({
      status: z.nativeEnum(CommissionStatus)
    })
  }),
  
  adjustCommission: z.object({
    body: z.object({
      type: z.nativeEnum(AdjustmentType),
      amount: z.number().positive(),
      reason: z.string().min(5)
    })
  }),
  
  createRule: z.object({
    body: z.object({
      ruleName: z.string().min(3),
      ruleType: z.nativeEnum(CommissionRuleType),
      targetType: z.nativeEnum(CommissionTargetType),
      targetId: z.string().optional(),
      rate: z.number().min(0).optional(),
      minAmount: z.number().min(0).optional(),
      maxAmount: z.number().min(0).optional(),
      priority: z.number().min(0),
      tiers: z.array(z.object({
        minThreshold: z.number(),
        maxThreshold: z.number().optional(),
        rate: z.number()
      })).optional()
    })
  })
};
