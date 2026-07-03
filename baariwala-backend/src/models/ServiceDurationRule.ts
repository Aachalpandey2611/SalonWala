import mongoose, { Document, Schema } from 'mongoose';

export enum DurationOverrideType {
  STAFF_SPECIFIC = 'STAFF_SPECIFIC', // Expert barbers might be faster
  AGE_SPECIFIC = 'AGE_SPECIFIC', // Kids haircuts might take longer
  HAIR_LENGTH_SPECIFIC = 'HAIR_LENGTH_SPECIFIC', // Long hair takes longer
}

export interface IServiceDurationRule extends Document {
  serviceId: mongoose.Types.ObjectId;
  type: DurationOverrideType;
  
  // Rule conditions
  staffId?: mongoose.Types.ObjectId; // If STAFF_SPECIFIC
  minAge?: number; // If AGE_SPECIFIC
  maxAge?: number;
  hairLength?: string; // e.g., 'SHORT', 'MEDIUM', 'LONG'
  
  // The overridden duration
  durationMultiplier?: number; // e.g. 1.2 for 20% longer
  flatOverrideDurationInMinutes?: number; // Overrides base duration entirely
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceDurationRuleSchema = new Schema<IServiceDurationRule>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true, index: true },
    type: { type: String, enum: Object.values(DurationOverrideType), required: true },
    
    staffId: { type: Schema.Types.ObjectId, ref: 'User' },
    minAge: { type: Number, min: 0 },
    maxAge: { type: Number, min: 0 },
    hairLength: { type: String },
    
    durationMultiplier: { type: Number, min: 0 },
    flatOverrideDurationInMinutes: { type: Number, min: 0 },
    
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const ServiceDurationRule = mongoose.model<IServiceDurationRule>('ServiceDurationRule', serviceDurationRuleSchema);
