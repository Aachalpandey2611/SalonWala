import mongoose, { Document, Schema } from 'mongoose';

export enum SupplierStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  BLACKLISTED = 'BLACKLISTED'
}

export interface ISupplier extends Document {
  salonId: mongoose.Types.ObjectId;
  
  companyName: string;
  gstNumber?: string;
  panNumber?: string;
  
  rating: number; // 1.0 to 5.0
  isPreferred: boolean;
  status: SupplierStatus;
  
  paymentTerms?: string; // e.g. "Net 30"
  
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  };

  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };

  createdAt: Date;
  updatedAt: Date;
}

const supplierSchema = new Schema<ISupplier>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    companyName: { type: String, required: true },
    gstNumber: { type: String },
    panNumber: { type: String },
    
    rating: { type: Number, default: 5.0, min: 1.0, max: 5.0 },
    isPreferred: { type: Boolean, default: false },
    status: { type: String, enum: Object.values(SupplierStatus), default: SupplierStatus.ACTIVE, index: true },
    
    paymentTerms: { type: String },
    
    bankDetails: {
      accountName: { type: String },
      accountNumber: { type: String },
      ifscCode: { type: String },
      bankName: { type: String }
    },

    address: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String }
    }
  },
  {
    timestamps: true,
  }
);

export const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema);
