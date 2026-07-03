import mongoose, { Document, Schema } from 'mongoose';

export enum GRNStatus {
  FULL = 'FULL',
  PARTIAL = 'PARTIAL',
  DAMAGED = 'DAMAGED',
  SHORT_SUPPLY = 'SHORT_SUPPLY',
  EXCESS_SUPPLY = 'EXCESS_SUPPLY'
}

export interface IGoodsReceipt extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  purchaseOrderId: mongoose.Types.ObjectId;
  
  grnNumber: string; // E.g. GRN-2026-001
  
  receivedBy: mongoose.Types.ObjectId; // User ID
  receivedDate: Date;
  
  status: GRNStatus;
  
  items: Array<{
    purchaseOrderItemId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    acceptedQuantity: number;
    rejectedQuantity: number;
    rejectionReason?: string;
  }>;

  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const goodsReceiptSchema = new Schema<IGoodsReceipt>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true, index: true },
    
    grnNumber: { type: String, required: true, unique: true },
    
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receivedDate: { type: Date, default: Date.now },
    
    status: { type: String, enum: Object.values(GRNStatus), required: true },
    
    items: [
      {
        purchaseOrderItemId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrderItem', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
        acceptedQuantity: { type: Number, required: true, min: 0 },
        rejectedQuantity: { type: Number, default: 0, min: 0 },
        rejectionReason: { type: String }
      }
    ],
    
    notes: { type: String }
  },
  {
    timestamps: true,
  }
);

export const GoodsReceipt = mongoose.model<IGoodsReceipt>('GoodsReceipt', goodsReceiptSchema);
