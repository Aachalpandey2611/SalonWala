import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceTax extends Document {
  invoiceId: mongoose.Types.ObjectId;
  invoiceItemId?: mongoose.Types.ObjectId; // Optional: If tax is calculated per-item
  
  taxType: 'CGST' | 'SGST' | 'IGST' | 'OTHER';
  hsnSacCode?: string;
  
  taxRatePercent: number;
  taxableAmount: number;
  taxAmount: number;
  
  createdAt: Date;
}

const invoiceTaxSchema = new Schema<IInvoiceTax>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    invoiceItemId: { type: Schema.Types.ObjectId, ref: 'InvoiceItem', index: true },
    
    taxType: { type: String, enum: ['CGST', 'SGST', 'IGST', 'OTHER'], required: true },
    hsnSacCode: { type: String },
    
    taxRatePercent: { type: Number, required: true, min: 0 },
    taxableAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const InvoiceTax = mongoose.model<IInvoiceTax>('InvoiceTax', invoiceTaxSchema);
