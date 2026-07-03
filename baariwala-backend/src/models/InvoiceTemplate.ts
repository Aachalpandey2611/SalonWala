import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoiceTemplate extends Document {
  salonId: mongoose.Types.ObjectId;
  
  templateName: string;
  isDefault: boolean;
  
  logoUrl?: string;
  headerText?: string;
  footerText?: string;
  termsAndConditions?: string;
  
  accentColor?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const invoiceTemplateSchema = new Schema<IInvoiceTemplate>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    templateName: { type: String, required: true, default: 'Standard' },
    isDefault: { type: Boolean, default: false },
    
    logoUrl: { type: String },
    headerText: { type: String },
    footerText: { type: String },
    termsAndConditions: { type: String },
    
    accentColor: { type: String, default: '#000000' },
  },
  {
    timestamps: true,
  }
);

export const InvoiceTemplate = mongoose.model<IInvoiceTemplate>('InvoiceTemplate', invoiceTemplateSchema);
