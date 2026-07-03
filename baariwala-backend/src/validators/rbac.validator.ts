import { z } from 'zod';

export const rbacSchemas = {
  assignRole: z.object({
    body: z.object({
      userId: z.string(),
      roleId: z.string(),
      tenantId: z.string().optional(),
      branchId: z.string().optional()
    })
  })
};
