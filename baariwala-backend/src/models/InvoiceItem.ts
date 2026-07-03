import mongoose, { Document, Schema } from 'mongoose';

export enum InvoiceItemType {
  PRIMARY_SERVICE = 'PRIMARY_SERVICE',
  ADDON_SERVICE = 'ADDON_SERVICE',
  RETAIL_PRODUCT = 'RETAIL_PRODUCT',
  MEMBERSHIP = 'MEMBERSHIP',
  MISCELLANEOUS = 'MISCELLANEOUS'
}

export interface IInvoiceItem extends Document {
  invoiceId: mongoose.Types.ObjectId;
  
  itemType: InvoiceItemType;
  referenceId?: string; // ID of the Service/Product
  
  name: string;
  quantity: number;
  unitPrice: number;
  
  discount: number;
  taxAmount: number;
  
  lineTotal: number; // (quantity * unitPrice) - discount + taxAmount
  
  createdAt: Date;
  updatedAt: Date;
}

const invoiceItemSchema = new Schema<IInvoiceItem>(
  {
    invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true, index: true },
    
    itemType: { type: String, enum: Object.values(InvoiceItemType), required: true },
    referenceId: { type: String },
    
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    
    discount: { type: Number, required: true, default: 0, min: 0 },
    taxAmount: { type: Number, required: true, default: 0, min: 0 },
    
    lineTotal: { type: Number, required: true, min: 0 },
  },
  {
    timestamps: true,
  }
);

export const InvoiceItem = mongoose.model<IInvoiceItem>('InvoiceItem', invoiceItemSchema);
