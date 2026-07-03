import mongoose, { Document, Schema } from 'mongoose';

export enum PricingOverrideType {
  WEEKEND = 'WEEKEND',
  FESTIVAL = 'FESTIVAL',
  HOLIDAY = 'HOLIDAY',
  PEAK_HOUR = 'PEAK_HOUR',
  MEMBERSHIP = 'MEMBERSHIP',
  DYNAMIC = 'DYNAMIC',
}

export interface IServicePricing extends Document {
  serviceId: mongoose.Types.ObjectId;
  type: PricingOverrideType;
  
  // Specific constraints for the override to be active
  validFrom?: Date;
  validTo?: Date;
  dayOfWeek?: string; // e.g., 'Saturday'
  startTime?: string; // For PEAK_HOUR e.g., '17:00'
  endTime?: string;   // e.g., '20:00'
  
  // The overridden price logic
  priceMultiplier?: number; // e.g., 1.5 for 150% price, 0.9 for 90% price
  flatOverridePrice?: number; // Overrides base price entirely if set
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const servicePricingSchema = new Schema<IServicePricing>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true, index: true },
    type: { type: String, enum: Object.values(PricingOverrideType), required: true },
    
    validFrom: { type: Date },
    validTo: { type: Date },
    dayOfWeek: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
    startTime: { type: String },
    endTime: { type: String },
    
    priceMultiplier: { type: Number, min: 0 }, // e.g., 1.2
    flatOverridePrice: { type: Number, min: 0 },
    
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ServicePricing = mongoose.model<IServicePricing>('ServicePricing', servicePricingSchema);
