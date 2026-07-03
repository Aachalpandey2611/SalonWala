import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceAddon extends Document {
  parentServiceId: mongoose.Types.ObjectId;
  addonServiceId: mongoose.Types.ObjectId;
  
  // The extra cost / time it adds. Often it's just the addon service's defaults,
  // but allowing them here supports bundle discounts (e.g., Haircut + Wash is cheaper than Wash alone).
  additionalDurationInMinutes: number;
  additionalPreparationTimeInMinutes: number;
  additionalCleanupTimeInMinutes: number;
  additionalPrice: number;
  
  isRecommended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const serviceAddonSchema = new Schema<IServiceAddon>(
  {
    parentServiceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true, index: true },
    addonServiceId: { type: Schema.Types.ObjectId, ref: 'SalonService', required: true, index: true },
    
    additionalDurationInMinutes: { type: Number, required: true, min: 0 },
    additionalPreparationTimeInMinutes: { type: Number, default: 0, min: 0 },
    additionalCleanupTimeInMinutes: { type: Number, default: 0, min: 0 },
    additionalPrice: { type: Number, required: true, min: 0 },
    
    isRecommended: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Prevent linking the exact same addon multiple times to the same parent
serviceAddonSchema.index({ parentServiceId: 1, addonServiceId: 1 }, { unique: true });

export const ServiceAddon = mongoose.model<IServiceAddon>('ServiceAddon', serviceAddonSchema);
