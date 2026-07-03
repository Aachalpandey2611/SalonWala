import { Request, Response } from 'express';
import { SupplierService } from '../services/supplier.service';
import { ProcurementService } from '../services/procurement.service';
import { PurchaseOrder } from '../models/PurchaseOrder';
import { GoodsReceipt } from '../models/GoodsReceipt';
import { catchAsync } from '../utils/catchAsync';

/**
 * SUPPLIER CONTROLLERS
 */
export const createSupplierController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const supplier = await SupplierService.createSupplier(salonId, req.body);
  res.status(201).json({ success: true, data: supplier });
});

export const getSuppliersController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const suppliers = await SupplierService.getSuppliers(salonId);
  res.status(200).json({ success: true, data: suppliers });
});

export const changeSupplierStatusController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const supplier = await SupplierService.updateSupplierStatus(id as string, status);
  res.status(200).json({ success: true, data: supplier });
});

/**
 * PURCHASE ORDER CONTROLLERS
 */
export const createPOController = catchAsync(async (req: Request, res: Response) => {
  const salonId = (req.user as any).salonId;
  const { branchId, supplierId, items, expectedDeliveryDate, notes } = req.body;
  const po = await ProcurementService.createPurchaseOrder(salonId, branchId, supplierId, req.user!.id, items, expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined, notes);
  res.status(201).json({ success: true, data: po });
});

export const approvePOController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const po = await ProcurementService.approvePurchaseOrder(id as string, req.user!.id);
  res.status(200).json({ success: true, data: po });
});

export const getPOsController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role !== 'SuperAdmin' && req.user!.role !== 'Admin') {
    filter.salonId = (req.user as any).salonId;
  }
  const pos = await PurchaseOrder.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: pos });
});

/**
 * GOODS RECEIPT CONTROLLERS
 */
export const receiveGoodsController = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params; // PO ID
  const { items, notes } = req.body;
  const grn = await ProcurementService.receiveGoods(id as string, req.user!.id, items, notes);
  res.status(201).json({ success: true, data: grn });
});

export const getGRNsController = catchAsync(async (req: Request, res: Response) => {
  const filter: any = {};
  if (req.user!.role !== 'SuperAdmin' && req.user!.role !== 'Admin') {
    filter.salonId = (req.user as any).salonId;
  }
  const grns = await GoodsReceipt.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: grns });
});
