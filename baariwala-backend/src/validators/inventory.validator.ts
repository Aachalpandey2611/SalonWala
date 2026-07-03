import { z } from 'zod';
import { MovementType } from '../models/InventoryMovement';
import { ProductCategory, ProductType } from '../models/Product';

export const inventorySchemas = {
  createProduct: z.object({
    body: z.object({
      name: z.string().min(1, 'Name is required'),
      sku: z.string().min(1, 'SKU is required'),
      barcode: z.string().optional(),
      category: z.nativeEnum(ProductCategory),
      productType: z.nativeEnum(ProductType),
      brand: z.string().min(1, 'Brand is required'),
      unit: z.string().min(1, 'Unit is required'),
      sellingPrice: z.number().min(0).optional(),
      purchasePrice: z.number().min(0),
      gstPercent: z.number().min(0).max(100)
    })
  }),
  
  adjustStock: z.object({
    body: z.object({
      movementType: z.nativeEnum(MovementType),
      quantity: z.number(), // Positive for IN, Negative for OUT
      reason: z.string().min(5, 'A valid reason is required for manual adjustments')
    }),
    params: z.object({
      inventoryId: z.string().min(1, 'Inventory ID is required')
    })
  })
};
