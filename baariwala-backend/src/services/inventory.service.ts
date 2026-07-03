import mongoose from 'mongoose';
import { Inventory } from '../models/Inventory';
import { InventoryMovement, MovementType } from '../models/InventoryMovement';
import { InventoryAudit, InventoryAuditAction } from '../models/InventoryAudit';
import { ProductConsumptionRule } from '../models/ProductConsumptionRule';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';

export interface StockAdjustmentPayload {
  inventoryId: string | mongoose.Types.ObjectId;
  movementType: MovementType;
  quantity: number; // Can be negative for deduction
  referenceId?: string | mongoose.Types.ObjectId;
  reason?: string;
  initiatedBy: string | mongoose.Types.ObjectId;
  initiatedBySystem: boolean;
}

export class InventoryService {
  /**
   * Adjusts stock safely using a transaction to prevent negative stock and concurrency issues.
   */
  static async adjustStock(payload: StockAdjustmentPayload) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const inventory = await Inventory.findById(payload.inventoryId).session(session);
      if (!inventory) throw new AppError('Inventory record not found', 404);
      
      const previousStock = inventory.availableStock;
      const newStock = previousStock + payload.quantity;
      
      if (newStock < 0) {
        throw new AppError(`Insufficient stock. Cannot deduct ${Math.abs(payload.quantity)} from ${previousStock}`, 400);
      }
      
      // Update stock
      inventory.availableStock = newStock;
      await inventory.save({ session });
      
      // Create movement log
      const movement = await InventoryMovement.create([{
        inventoryId: inventory._id,
        productId: inventory.productId,
        branchId: inventory.branchId,
        movementType: payload.movementType,
        quantity: payload.quantity,
        referenceId: payload.referenceId,
        reason: payload.reason,
        initiatedBy: payload.initiatedBy,
        initiatedBySystem: payload.initiatedBySystem
      }], { session });
      
      // Map movement type to audit action
      let auditAction = InventoryAuditAction.STOCK_ADJUSTED;
      if (payload.movementType === MovementType.PURCHASE || payload.movementType === MovementType.TRANSFER_IN) {
        auditAction = InventoryAuditAction.STOCK_RECEIVED;
      } else if (payload.movementType === MovementType.CONSUMPTION) {
        auditAction = InventoryAuditAction.STOCK_CONSUMED;
      } else if (payload.movementType === MovementType.TRANSFER_OUT) {
        auditAction = InventoryAuditAction.STOCK_TRANSFERRED;
      }
      
      // Create audit log
      await InventoryAudit.create([{
        inventoryId: inventory._id,
        movementId: movement[0]._id,
        action: auditAction,
        previousAvailableStock: previousStock,
        newAvailableStock: newStock,
        initiatedBy: payload.initiatedBy,
        initiatedBySystem: payload.initiatedBySystem
      }], { session });
      
      await session.commitTransaction();
      session.endSession();
      
      // Post-transaction logic: Check thresholds
      if (newStock <= inventory.reorderLevel) {
        EventBusService.publish('LowStockDetected', {
          inventoryId: inventory._id,
          productId: inventory.productId,
          branchId: inventory.branchId,
          currentStock: newStock,
          reorderLevel: inventory.reorderLevel
        }, 'InventoryEngine');
      }
      
      return movement[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }

  /**
   * Called via Event Listener when an Appointment completes.
   * Auto-consumes products based on SalonService rules.
   */
  static async processServiceConsumption(appointmentId: string, serviceIds: string[], branchId: string, systemAdminId: string) {
    for (const serviceId of serviceIds) {
      const rule = await ProductConsumptionRule.findOne({ serviceId, isActive: true });
      if (!rule) continue; // No products consumed for this service
      
      for (const item of rule.items) {
        // Find inventory for this product at this branch
        const inventory = await Inventory.findOne({ productId: item.productId, branchId });
        if (!inventory) {
          console.warn(`[InventoryService] Cannot consume product ${item.productId}: No inventory record found for branch ${branchId}`);
          continue;
        }
        
        try {
          await this.adjustStock({
            inventoryId: inventory._id,
            movementType: MovementType.CONSUMPTION,
            quantity: -Math.abs(item.quantity), // Always deduct
            referenceId: appointmentId,
            reason: `Auto-consumption for completed appointment ${appointmentId}`,
            initiatedBy: systemAdminId,
            initiatedBySystem: true
          });
        } catch (error: any) {
          // Log but do not crash the booking flow! It's better to allow the booking to complete
          // and log an inventory error than to fail the customer's checkout due to missing 5ml of shampoo.
          console.error(`[InventoryService] Failed to deduct stock for appointment ${appointmentId}: ${error.message}`);
        }
      }
    }
  }
}
