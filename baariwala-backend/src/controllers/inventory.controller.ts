import { Request, Response } from 'express';
import { Product, ProductStatus } from '../models/Product';
import { Inventory } from '../models/Inventory';
import { InventoryService } from '../services/inventory.service';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/AppError';

export const createProductController = catchAsync(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

export const getProductsController = catchAsync(async (req: Request, res: Response) => {
  const products = await Product.find({ status: ProductStatus.ACTIVE });
  res.status(200).json({ success: true, data: products });
});

export const getInventoryController = catchAsync(async (req: Request, res: Response) => {
  const branchId = req.query.branchId as string;
  const filter = branchId ? { branchId } : {};
  
  const inventory = await Inventory.find(filter).populate('productId');
  res.status(200).json({ success: true, data: inventory });
});

export const adjustStockController = catchAsync(async (req: Request, res: Response) => {
  const inventoryId = req.params.inventoryId as string;
  
  const movement = await InventoryService.adjustStock({
    inventoryId,
    movementType: req.body.movementType,
    quantity: req.body.quantity,
    reason: req.body.reason,
    initiatedBy: req.user!.id,
    initiatedBySystem: false
  });
  
  res.status(200).json({ success: true, data: movement });
});
