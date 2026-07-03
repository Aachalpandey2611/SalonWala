import mongoose, { Document, Schema } from 'mongoose';
import { InvoiceStatus, PaymentStatus } from './Invoice';

export interface IInvoiceHistory extends Document {
  invoiceId: mongoose.Types.ObjectId;
  
  action: string;
  previousStatus?: InvoiceStatus | PaymentStatus;
  newStatus?: InvoiceStatus | PaymentStatus;
  
  notes?: string;
  initiatedBy?: mongoose.Types.ObjectId; // Optional, might be SYSTEM
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const invoiceHistorySchema = new Schema<IInvoiceHistory>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    
    action: { type: String, required: true },
    previousStatus: { type: String },
    newStatus: { type: String },
    
    notes: { type: String },
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const InvoiceHistory = mongoose.model<IInvoiceHistory>('InvoiceHistory', invoiceHistorySchema);
