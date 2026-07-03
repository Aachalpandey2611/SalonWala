import { Request, Response } from 'express';
import { ServicePricing } from '../models/ServicePricing';
import { ServiceTax } from '../models/ServiceTax';
import { ServiceDiscount } from '../models/ServiceDiscount';
import { SalonService } from '../models/SalonService';
import { Salon } from '../models/Salon';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

const verifySalonOwnership = async (salonId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return;
  const salon = await Salon.findById(salonId);
  if (!salon) throw new AppError('Salon not found', 404);
  if (salon.ownerId.toString() !== userId && role !== UserRole.ADMIN) {
    throw new AppError('You do not have permission', 403);
  }
};

const verifyServiceOwnership = async (serviceId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return;
  const service = await SalonService.findById(serviceId);
  if (!service) throw new AppError('Service not found', 404);
  await verifySalonOwnership(service.salonId.toString(), userId, role);
};

// ==========================================
// PRICING OVERRIDES
// ==========================================
export const createPricingOverride = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.serviceId as string;
  await verifyServiceOwnership(serviceId, req.user!.id, req.user!.role);
  
  const pricing = await ServicePricing.create({
    serviceId,
    ...req.body
  });
  
  res.status(201).json({ success: true, data: pricing });
});

export const getPricingOverrides = catchAsync(async (req: Request, res: Response) => {
  const overrides = await ServicePricing.find({ serviceId: req.params.serviceId });
  res.status(200).json({ success: true, data: overrides });
});

// ==========================================
// TAXES
// ==========================================
export const createTax = catchAsync(async (req: Request, res: Response) => {
  await verifySalonOwnership(req.body.salonId, req.user!.id, req.user!.role);
  
  const tax = await ServiceTax.create(req.body);
  res.status(201).json({ success: true, data: tax });
});

export const getTaxes = catchAsync(async (req: Request, res: Response) => {
  const { salonId, branchId } = req.query;
  const query: any = {};
  if (salonId) query.salonId = salonId;
  if (branchId) query.branchId = branchId;
  
  const taxes = await ServiceTax.find(query);
  res.status(200).json({ success: true, data: taxes });
});

// ==========================================
// DISCOUNTS
// ==========================================
export const createDiscount = catchAsync(async (req: Request, res: Response) => {
  await verifySalonOwnership(req.body.salonId, req.user!.id, req.user!.role);
  
  if (req.body.code) {
    const existing = await ServiceDiscount.findOne({ salonId: req.body.salonId, code: req.body.code });
    if (existing) throw new AppError('Discount code already exists for this salon', 400);
  }

  const discount = await ServiceDiscount.create(req.body);
  res.status(201).json({ success: true, data: discount });
});

export const getDiscounts = catchAsync(async (req: Request, res: Response) => {
  const salonId = req.query.salonId as string;
  const discounts = await ServiceDiscount.find({ salonId });
  res.status(200).json({ success: true, data: discounts });
});
