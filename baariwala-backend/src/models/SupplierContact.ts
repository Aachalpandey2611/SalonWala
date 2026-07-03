import mongoose, { Document, Schema } from 'mongoose';

export interface ISupplierContact extends Document {
  supplierId: mongoose.Types.ObjectId;
  
  firstName: string;
  lastName: string;
  
  email?: string;
  phone: string;
  
  designation?: string;
  isPrimary: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const supplierContactSchema = new Schema<ISupplierContact>(
  {
    supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true, index: true },
    
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    
    email: { type: String },
    phone: { type: String, required: true },
    
    designation: { type: String },
    isPrimary: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

export const SupplierContact = mongoose.model<ISupplierContact>('SupplierContact', supplierContactSchema);
