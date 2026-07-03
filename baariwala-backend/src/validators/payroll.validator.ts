import { z } from 'zod';
import { PayrollCycleType } from '../models/PayrollCycle';
import { PayrollAdjustmentType } from '../models/PayrollAdjustment';

export const payrollSchemas = {
  createCycle: z.object({
    body: z.object({
      name: z.string().min(3),
      cycleType: z.nativeEnum(PayrollCycleType),
      startDate: z.string().datetime(),
      endDate: z.string().datetime()
    })
  }),
  
  generatePayroll: z.object({
    body: z.object({
      branchId: z.string().length(24)
    })
  }),
  
  adjustPayroll: z.object({
    body: z.object({
      type: z.nativeEnum(PayrollAdjustmentType),
      amount: z.number().positive(),
      reason: z.string().min(3)
    })
  })
};
