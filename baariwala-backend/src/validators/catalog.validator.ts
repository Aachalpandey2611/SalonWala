import { z } from 'zod';
import { CategoryStatus } from '../models/ServiceCategory';
import { ServiceStatus, GenderAvailability } from '../models/SalonService';
import { PricingOverrideType } from '../models/ServicePricing';
import { TaxType } from '../models/ServiceTax';
import { DiscountType } from '../models/ServiceDiscount';
import { DurationOverrideType } from '../models/ServiceDurationRule';

export const catalogSchemas = {
  // CATEGORIES
  createCategory: z.object({
    body: z.object({
      salonId: z.string().min(1, 'Salon ID is required'),
      name: z.string().min(2, 'Name must be at least 2 characters'),
      description: z.string().max(500).optional(),
      displayOrder: z.number().int().default(0),
    }),
  }),
  updateCategory: z.object({
    params: z.object({ id: z.string() }),
    body: z.object({
      name: z.string().min(2).optional(),
      description: z.string().max(500).optional(),
      displayOrder: z.number().int().optional(),
      status: z.nativeEnum(CategoryStatus).optional(),
      visibility: z.boolean().optional(),
    }),
  }),

  // SERVICES
  createService: z.object({
    body: z.object({
      salonId: z.string().min(1),
      branchId: z.string().min(1),
      categoryId: z.string().min(1),
      name: z.string().min(2),
      description: z.string().max(1000).optional(),
      
      durationInMinutes: z.number().int().min(1, 'Duration must be at least 1 minute'),
      preparationTimeInMinutes: z.number().int().min(0).default(0),
      cleanupTimeInMinutes: z.number().int().min(0).default(0),
      
      basePrice: z.number().min(0, 'Price cannot be negative'),
      currency: z.string().default('INR'),
      gstPercentage: z.number().min(0).max(100).default(18),
      
      minimumBarberSkill: z.string().optional(),
      requiredExperienceInYears: z.number().min(0).optional(),
      maximumCapacity: z.number().int().min(1).default(1),
      
      genderAvailability: z.nativeEnum(GenderAvailability).default(GenderAvailability.UNISEX),
      minimumAge: z.number().min(0).optional(),
      maximumAge: z.number().min(0).optional(),
    }),
  }),

  // ADD-ONS
  createAddon: z.object({
    params: z.object({ parentServiceId: z.string() }),
    body: z.object({
      addonServiceId: z.string().min(1),
      additionalDurationInMinutes: z.number().int().min(0),
      additionalPreparationTimeInMinutes: z.number().int().min(0).default(0),
      additionalCleanupTimeInMinutes: z.number().int().min(0).default(0),
      additionalPrice: z.number().min(0),
      isRecommended: z.boolean().default(true),
    }),
  }),

  // PRICING OVERRIDES
  createPricing: z.object({
    params: z.object({ serviceId: z.string() }),
    body: z.object({
      type: z.nativeEnum(PricingOverrideType),
      validFrom: z.string().optional(),
      validTo: z.string().optional(),
      dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']).optional(),
      startTime: z.string().optional(),
      endTime: z.string().optional(),
      priceMultiplier: z.number().min(0).optional(),
      flatOverridePrice: z.number().min(0).optional(),
    }).refine((data) => data.priceMultiplier !== undefined || data.flatOverridePrice !== undefined, {
      message: 'Must provide either priceMultiplier or flatOverridePrice',
      path: ['flatOverridePrice'],
    }),
  }),

  // TAXES
  createTax: z.object({
    body: z.object({
      salonId: z.string().min(1),
      branchId: z.string().optional(),
      name: z.string().min(2),
      type: z.nativeEnum(TaxType),
      percentage: z.number().min(0).max(100),
    }),
  }),

  // DISCOUNTS
  createDiscount: z.object({
    body: z.object({
      salonId: z.string().min(1),
      name: z.string().min(2),
      code: z.string().optional(),
      type: z.nativeEnum(DiscountType),
      flatAmount: z.number().min(0).optional(),
      percentage: z.number().min(0).max(100).optional(),
      maxDiscountAmount: z.number().min(0).optional(),
      validFrom: z.string(),
      validTo: z.string(),
      applicableBranchIds: z.array(z.string()).default([]),
      applicableServiceIds: z.array(z.string()).default([]),
      isStackable: z.boolean().default(false),
    }).refine((data) => data.flatAmount !== undefined || data.percentage !== undefined, {
      message: 'Must provide either flatAmount or percentage',
      path: ['percentage'],
    }),
  }),

  // SIMULATE / CALCULATE SERVICE
  calculateTotal: z.object({
    body: z.object({
      serviceId: z.string().min(1),
      addonIds: z.array(z.string()).default([]),
    }),
  }),
};
