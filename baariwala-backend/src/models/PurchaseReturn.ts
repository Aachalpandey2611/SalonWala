import mongoose, { Document, Schema } from 'mongoose';

export enum ReturnReason {
  WRONG_PRODUCT = 'WRONG_PRODUCT',
  DAMAGED_PRODUCT = 'DAMAGED_PRODUCT',
  EXPIRED_PRODUCT = 'EXPIRED_PRODUCT',
  SUPPLIER_ERROR = 'SUPPLIER_ERROR',
  QUALITY_ISSUE = 'QUALITY_ISSUE'
}

export interface IPurchaseReturn extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  supplierId: mongoose.Types.ObjectId;
  purchaseOrderId?: mongoose.Types.ObjectId; // Optional if returning old stock without specific PO
  grnId?: mongoose.Types.ObjectId;
  
  returnNumber: string;
  
  items: Array<{
    productId: mongoose.Types.ObjectId;
    quantity: number;
    reason: ReturnReason;
    notes?: string;
  }>;
  
  totalReturnAmount: number; // Configurable refund expectations
  
  returnedBy: mongoose.Types.ObjectId;
  returnDate: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const purchaseReturnSchema = new Schema<IPurchaseReturn>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    grnId: { type: Schema.Types.ObjectId, ref: 'GoodsReceipt' },
    
    returnNumber: { type: String, required: true, unique: true },
    
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'InventoryItem', required: true },
        quantity: { type: Number, required: true, min: 1 },
        reason: { type: String, enum: Object.values(ReturnReason), required: true },
        notes: { type: String }
      }
    ],
    
    totalReturnAmount: { type: Number, default: 0 },
    
    returnedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    returnDate: { type: Date, default: Date.now }
  },
  {
    timestamps: true,
  }
);

export const PurchaseReturn = mongoose.model<IPurchaseReturn>('PurchaseReturn', purchaseReturnSchema);
