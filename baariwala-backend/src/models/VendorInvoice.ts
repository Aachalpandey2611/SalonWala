import mongoose, { Document, Schema } from 'mongoose';

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PARTIAL_PAID = 'PARTIAL_PAID',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE'
}

export interface IVendorInvoice extends Document {
  salonId: mongoose.Types.ObjectId;
  purchaseOrderId: mongoose.Types.ObjectId;
  grnId: mongoose.Types.ObjectId;
  supplierId: mongoose.Types.ObjectId;
  
  invoiceNumber: string; // The supplier's invoice number
  invoiceDate: Date;
  dueDate: Date;
  
  totalAmount: number;
  taxAmount: number;
  discountAmount: number;
  payableAmount: number; // Final amount to be paid
  
  amountPaid: number;
  status: InvoiceStatus;
  
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const vendorInvoiceSchema = new Schema<IVendorInvoice>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
    grnId: { type: Schema.Types.ObjectId, ref: 'GoodsReceipt', required: true },
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
    
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    payableAmount: { type: Number, required: true },
    
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(InvoiceStatus), default: InvoiceStatus.PENDING, index: true },
    
    notes: { type: String }
  },
  {
    timestamps: true,
  }
);

export const VendorInvoice = mongoose.model<IVendorInvoice>('VendorInvoice', vendorInvoiceSchema);
