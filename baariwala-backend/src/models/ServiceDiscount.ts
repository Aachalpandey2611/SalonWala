import mongoose, { Document, Schema } from 'mongoose';

export enum DiscountType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
  MEMBERSHIP = 'MEMBERSHIP',
  FESTIVAL_OFFER = 'FESTIVAL_OFFER',
  FIRST_VISIT = 'FIRST_VISIT',
  BIRTHDAY = 'BIRTHDAY',
  REFERRAL = 'REFERRAL',
  LOYALTY = 'LOYALTY',
}

export interface IServiceDiscount extends Document {
  salonId: mongoose.Types.ObjectId;
  name: string;
  code?: string; // Optional coupon code
  type: DiscountType;
  
  flatAmount?: number;
  percentage?: number; // 0-100
  maxDiscountAmount?: number; // Cap for percentage discounts
  
  validFrom: Date;
  validTo: Date;
  
  applicableBranchIds: mongoose.Types.ObjectId[]; // Empty = all branches
  applicableServiceIds: mongoose.Types.ObjectId[]; // Empty = all services
  
  isStackable: boolean; // Can be combined with other discounts
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceDiscountSchema = new Schema<IServiceDiscount>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true, uppercase: true }, // e.g., 'DIWALI50'
    type: { type: String, enum: Object.values(DiscountType), required: true },
    
    flatAmount: { type: Number, min: 0 },
    percentage: { type: Number, min: 0, max: 100 },
    maxDiscountAmount: { type: Number, min: 0 },
    
    validFrom: { type: Date, required: true },
    validTo: { type: Date, required: true },
    
    applicableBranchIds: [{ type: Schema.Types.ObjectId, ref: 'SalonBranch' }],
    applicableServiceIds: [{ type: Schema.Types.ObjectId, ref: 'SalonService' }],
    
    isStackable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Discount Code should be unique per salon if it exists
serviceDiscountSchema.index({ salonId: 1, code: 1 }, { unique: true, partialFilterExpression: { code: { $exists: true } } });

export const ServiceDiscount = mongoose.model<IServiceDiscount>('ServiceDiscount', serviceDiscountSchema);
