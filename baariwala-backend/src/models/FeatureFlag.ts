import mongoose, { Document, Schema } from 'mongoose';

export interface IFeatureFlag extends Document {
  key: string; // e.g. "ENABLE_AI_RECOMMENDATIONS"
  description: string;
  
  isEnabledGlobally: boolean;
  
  // Specific Overrides
  enabledForTenants: mongoose.Types.ObjectId[]; // Only these tenants get it
  disabledForTenants: mongoose.Types.ObjectId[]; // Opt-out
  
  rolloutPercentage: number; // e.g. 20 (20% of users get it)
  
  createdAt: Date;
  updatedAt: Date;
}

const featureFlagSchema = new Schema<IFeatureFlag>(
  {
    key: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    
    isEnabledGlobally: { type: Boolean, default: false },
    
    enabledForTenants: [{ type: Schema.Types.ObjectId, ref: 'Tenant' }],
    disabledForTenants: [{ type: Schema.Types.ObjectId, ref: 'Tenant' }],
    
    rolloutPercentage: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

export const FeatureFlag = mongoose.model<IFeatureFlag>('FeatureFlag', featureFlagSchema);
