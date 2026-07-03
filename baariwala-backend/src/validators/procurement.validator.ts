import { z } from 'zod';
import { SupplierStatus } from '../models/Supplier';

export const procurementSchemas = {
  createSupplier: z.object({
    body: z.object({
      companyName: z.string().min(2),
      gstNumber: z.string().optional(),
      panNumber: z.string().optional(),
      paymentTerms: z.string().optional(),
      isPreferred: z.boolean().optional(),
      contacts: z.array(z.object({
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email().optional(),
        phone: z.string(),
        isPrimary: z.boolean().optional()
      })).optional()
    })
  }),

  changeSupplierStatus: z.object({
    body: z.object({
      status: z.nativeEnum(SupplierStatus)
    })
  }),

  createPO: z.object({
    body: z.object({
      branchId: z.string().length(24),
      supplierId: z.string().length(24),
      expectedDeliveryDate: z.string().datetime().optional(),
      notes: z.string().optional(),
      items: z.array(z.object({
        productId: z.string().length(24),
        expectedQuantity: z.number().positive(),
        unitPrice: z.number().min(0),
        discount: z.number().min(0).default(0),
        tax: z.number().min(0).default(0),
        gst: z.number().min(0).default(0)
      })).min(1)
    })
  }),

  receiveGoods: z.object({
    body: z.object({
      notes: z.string().optional(),
      items: z.array(z.object({
        purchaseOrderItemId: z.string().length(24),
        productId: z.string().length(24),
        acceptedQuantity: z.number().min(0),
        rejectedQuantity: z.number().min(0).default(0),
        rejectionReason: z.string().optional()
      })).min(1)
    })
  })
};
