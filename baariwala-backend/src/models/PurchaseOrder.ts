import mongoose, { Document, Schema } from 'mongoose';

export enum POStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PARTIAL_RECEIVED = 'PARTIAL_RECEIVED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED'
}

export interface IPurchaseOrder extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  supplierId: mongoose.Types.ObjectId;
  poNumber: string;
  
  status: POStatus;
  
  orderedBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
  
  orderDate: Date;
  expectedDeliveryDate?: Date;
  
  totalAmount: number;
  totalTax: number;
  totalDiscount: number;
  netAmount: number;
  
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const purchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
    poNumber: { type: String, required: true, unique: true },
    
    status: { type: String, enum: Object.values(POStatus), default: POStatus.DRAFT, index: true },
    
    orderedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    
    orderDate: { type: Date, required: true },
    expectedDeliveryDate: { type: Date },
    
    totalAmount: { type: Number, default: 0 },
    totalTax: { type: Number, default: 0 },
    totalDiscount: { type: Number, default: 0 },
    netAmount: { type: Number, default: 0 },
    
    notes: { type: String }
  },
  {
    timestamps: true,
  }
);

export const PurchaseOrder = mongoose.model<IPurchaseOrder>('PurchaseOrder', purchaseOrderSchema);
