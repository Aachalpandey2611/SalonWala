import { PurchaseOrder, POStatus } from '../models/PurchaseOrder';
import { PurchaseOrderItem } from '../models/PurchaseOrderItem';
import { GoodsReceipt, GRNStatus } from '../models/GoodsReceipt';
import { ProcurementAudit, ProcurementAuditAction } from '../models/ProcurementAudit';
import { EventBusService } from './eventBus.service';
import { AppError } from '../utils/AppError';
import mongoose from 'mongoose';

export class ProcurementService {
  /**
   * Create Purchase Order
   */
  static async createPurchaseOrder(salonId: string, branchId: string, supplierId: string, orderedBy: string, items: any[], expectedDeliveryDate?: Date, notes?: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const poNumber = `PO-${Date.now()}`;
      
      let totalAmount = 0;
      let totalTax = 0;
      let totalDiscount = 0;
      let netAmount = 0;

      const orderItemsToInsert = items.map(item => {
        const itemNet = (item.unitPrice * item.expectedQuantity) - item.discount + item.tax + item.gst;
        
        totalAmount += (item.unitPrice * item.expectedQuantity);
        totalTax += item.tax + item.gst;
        totalDiscount += item.discount;
        netAmount += itemNet;
        
        return {
          productId: item.productId,
          expectedQuantity: item.expectedQuantity,
          unitPrice: item.unitPrice,
          discount: item.discount,
          tax: item.tax,
          gst: item.gst,
          netAmount: itemNet
        };
      });

      const po = await PurchaseOrder.create([{
        salonId,
        branchId,
        supplierId,
        poNumber,
        orderedBy,
        orderDate: new Date(),
        expectedDeliveryDate,
        totalAmount,
        totalTax,
        totalDiscount,
        netAmount,
        notes,
        status: POStatus.PENDING_APPROVAL
      }], { session });

      const mappedItems = orderItemsToInsert.map(i => ({ ...i, purchaseOrderId: po[0]._id }));
      await PurchaseOrderItem.insertMany(mappedItems, { session });

      await ProcurementAudit.create([{
        salonId,
        action: ProcurementAuditAction.PO_CREATED,
        performedBy: orderedBy,
        targetId: po[0]._id,
        details: { poNumber }
      }], { session });

      await session.commitTransaction();
      
      await EventBusService.publish('PurchaseOrderCreated', { poId: po[0]._id }, 'ProcurementEngine');
      
      return po[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Approve Purchase Order
   */
  static async approvePurchaseOrder(poId: string, adminId: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const po = await PurchaseOrder.findById(poId).session(session);
      if (!po) throw new AppError('PO not found', 404);
      if (po.status !== POStatus.PENDING_APPROVAL) throw new AppError('Invalid state', 400);

      po.status = POStatus.APPROVED;
      po.approvedBy = adminId as any;
      await po.save({ session });

      await ProcurementAudit.create([{
        salonId: po.salonId,
        action: ProcurementAuditAction.PO_APPROVED,
        performedBy: adminId,
        targetId: po._id,
        details: {}
      }], { session });

      await session.commitTransaction();

      await EventBusService.publish('PurchaseApproved', { poId: po._id }, 'ProcurementEngine');

      return po;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  /**
   * Receive Goods (GRN)
   */
  static async receiveGoods(poId: string, receivedBy: string, items: any[], notes?: string) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      const po = await PurchaseOrder.findById(poId).session(session);
      if (!po) throw new AppError('PO not found', 404);
      if (po.status !== POStatus.APPROVED && po.status !== POStatus.PARTIAL_RECEIVED) {
        throw new AppError('Cannot receive goods for this PO', 400);
      }

      const grnNumber = `GRN-${Date.now()}`;
      
      const grnItems = items.map(item => ({
        purchaseOrderItemId: item.purchaseOrderItemId,
        productId: item.productId,
        acceptedQuantity: item.acceptedQuantity,
        rejectedQuantity: item.rejectedQuantity,
        rejectionReason: item.rejectionReason
      }));

      const grn = await GoodsReceipt.create([{
        salonId: po.salonId,
        branchId: po.branchId,
        purchaseOrderId: po._id,
        grnNumber,
        receivedBy,
        status: GRNStatus.FULL, // simplified logic, usually derived
        items: grnItems,
        notes
      }], { session });

      // Update PO status
      po.status = POStatus.PARTIAL_RECEIVED; // simplified
      await po.save({ session });

      // Update PO Items
      for (const item of grnItems) {
        await PurchaseOrderItem.findByIdAndUpdate(item.purchaseOrderItemId, {
          $inc: { receivedQuantity: item.acceptedQuantity }
        }).session(session);
      }

      await ProcurementAudit.create([{
        salonId: po.salonId,
        action: ProcurementAuditAction.GRN_CREATED,
        performedBy: receivedBy,
        targetId: grn[0]._id,
        details: { grnNumber }
      }], { session });

      await session.commitTransaction();

      // **CRITICAL EVENT** => Inventory engine must consume this to increase stock!
      await EventBusService.publish('GoodsReceived', { 
        grnId: grn[0]._id, 
        branchId: po.branchId,
        items: grnItems 
      }, 'ProcurementEngine');

      return grn[0];
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
