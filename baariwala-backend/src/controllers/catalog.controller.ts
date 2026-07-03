import { Request, Response } from 'express';
import { ServiceCategory, CategoryStatus } from '../models/ServiceCategory';
import { SalonService, ServiceStatus } from '../models/SalonService';
import { ServiceAddon } from '../models/ServiceAddon';
import { Salon } from '../models/Salon';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';
import { UserRole } from '../constants/roles';

// Ownership verifiers (Re-using logic pattern from salon.controller)
const verifySalonOwnership = async (salonId: string, userId: string, role: string) => {
  if (role === UserRole.SUPER_ADMIN) return;
  const salon = await Salon.findById(salonId);
  if (!salon) throw new AppError('Salon not found', 404);
  if (salon.ownerId.toString() !== userId && role !== UserRole.ADMIN) {
    throw new AppError('You do not have permission to manage this salon', 403);
  }
};

const verifyServiceOwnership = async (serviceId: string, userId: string, role: string) => {
  const service = await SalonService.findById(serviceId);
  if (!service) throw new AppError('Service not found', 404);
  if (role === UserRole.SUPER_ADMIN) return service;
  await verifySalonOwnership(service.salonId.toString(), userId, role);
  return service;
};

// ==========================================
// CATEGORIES
// ==========================================
export const createCategory = catchAsync(async (req: Request, res: Response) => {
  await verifySalonOwnership(req.body.salonId, req.user!.id, req.user!.role);
  const category = await ServiceCategory.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export const getCategories = catchAsync(async (req: Request, res: Response) => {
  const { salonId } = req.query;
  const query: any = {};
  if (salonId) query.salonId = salonId;
  
  const categories = await ServiceCategory.find(query).sort({ displayOrder: 1 });
  res.status(200).json({ success: true, data: categories });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const category = await ServiceCategory.findById(categoryId);
  if (!category) throw new AppError('Category not found', 404);
  
  await verifySalonOwnership(category.salonId.toString(), req.user!.id, req.user!.role);
  
  Object.assign(category, req.body);
  await category.save();
  
  res.status(200).json({ success: true, data: category });
});

// ==========================================
// SERVICES
// ==========================================
export const createService = catchAsync(async (req: Request, res: Response) => {
  await verifySalonOwnership(req.body.salonId, req.user!.id, req.user!.role);
  
  const existing = await SalonService.findOne({ branchId: req.body.branchId, name: req.body.name });
  if (existing) throw new AppError('A service with this name already exists in this branch', 400);

  const service = await SalonService.create(req.body);
  res.status(201).json({ success: true, data: service });
});

export const getServices = catchAsync(async (req: Request, res: Response) => {
  const { branchId, categoryId } = req.query;
  const query: any = {};
  if (branchId) query.branchId = branchId;
  if (categoryId) query.categoryId = categoryId;
  
  const services = await SalonService.find(query).populate('categoryId', 'name icon');
  res.status(200).json({ success: true, data: services });
});

export const updateService = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id as string;
  const service = await verifyServiceOwnership(serviceId, req.user!.id, req.user!.role);
  
  Object.assign(service, req.body);
  await service!.save();
  
  res.status(200).json({ success: true, data: service });
});

// ==========================================
// ADD-ONS
// ==========================================
export const createAddon = catchAsync(async (req: Request, res: Response) => {
  const parentServiceId = req.params.parentServiceId as string;
  await verifyServiceOwnership(parentServiceId, req.user!.id, req.user!.role);
  
  // Verify addon service belongs to same salon
  const parent = await SalonService.findById(parentServiceId);
  const addonService = await SalonService.findById(req.body.addonServiceId);
  if (!addonService || addonService.salonId.toString() !== parent!.salonId.toString()) {
    throw new AppError('Add-on must belong to the same salon', 400);
  }

  const addon = await ServiceAddon.create({
    parentServiceId,
    ...req.body
  });

  res.status(201).json({ success: true, data: addon });
});

// ==========================================
// SMART ENGINE (SIMULATION)
// ==========================================
export const calculateServiceTotal = catchAsync(async (req: Request, res: Response) => {
  const { serviceId, addonIds } = req.body;
  
  const service = await SalonService.findById(serviceId);
  if (!service) throw new AppError('Service not found', 404);

  let totalDuration = service.totalCalculatedDuration;
  let totalPrice = service.basePrice;
  let totalPrep = service.preparationTimeInMinutes;
  let totalCleanup = service.cleanupTimeInMinutes;
  
  // Future: Here we would fetch ServicePricing rules for `serviceId` based on current time/date
  // and apply multipliers. For now we use base defaults.

  const selectedAddons = await ServiceAddon.find({
    parentServiceId: serviceId,
    addonServiceId: { $in: addonIds }
  });

  selectedAddons.forEach(addon => {
    totalDuration += addon.additionalDurationInMinutes + addon.additionalPreparationTimeInMinutes + addon.additionalCleanupTimeInMinutes;
    totalPrep += addon.additionalPreparationTimeInMinutes;
    totalCleanup += addon.additionalCleanupTimeInMinutes;
    totalPrice += addon.additionalPrice;
  });

  res.status(200).json({
    success: true,
    data: {
      baseService: service.name,
      appliedAddonsCount: selectedAddons.length,
      breakdown: {
        preparationTime: totalPrep,
        activeServiceTime: totalDuration - totalPrep - totalCleanup,
        cleanupTime: totalCleanup,
        totalSlotReserved: totalDuration,
      },
      pricing: {
        subtotal: totalPrice,
        gstPercentage: service.gstPercentage,
        estimatedTax: (totalPrice * service.gstPercentage) / 100,
        estimatedTotal: totalPrice + ((totalPrice * service.gstPercentage) / 100)
      }
    }
  });
});
