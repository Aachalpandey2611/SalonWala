import mongoose, { Document, Schema } from 'mongoose';

export enum CommissionRuleType {
  FLAT = 'FLAT',
  PERCENTAGE = 'PERCENTAGE',
  HYBRID = 'HYBRID',
  TIER_BASED = 'TIER_BASED'
}

export enum CommissionTargetType {
  ROLE = 'ROLE',
  SERVICE = 'SERVICE',
  PRODUCT = 'PRODUCT',
  MEMBERSHIP = 'MEMBERSHIP',
  CAMPAIGN = 'CAMPAIGN',
  BRANCH = 'BRANCH',
  DEFAULT = 'DEFAULT' // Catch-all if specific rules don't exist
}

export interface ICommissionTier {
  minThreshold: number;
  maxThreshold?: number; // Optional upper limit for highest tier
  rate: number;
}

export interface ICommissionRule extends Document {
  salonId: mongoose.Types.ObjectId;
  
  ruleName: string;
  ruleType: CommissionRuleType;
  
  targetType: CommissionTargetType;
  targetId?: string; // ID of the Role, Service, Product, etc. (Can be a string enum for Roles)
  
  // FLAT or PERCENTAGE
  rate?: number;
  
  // HYBRID
  minAmount?: number;
  maxAmount?: number;
  
  // TIER_BASED
  tiers?: ICommissionTier[];
  
  priority: number; // Higher number wins
  
  validFrom?: Date;
  validTo?: Date;
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const commissionTierSchema = new Schema<ICommissionTier>({
  minThreshold: { type: Number, required: true },
  maxThreshold: { type: Number },
  rate: { type: Number, required: true }
}, { _id: false });

const commissionRuleSchema = new Schema<ICommissionRule>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    ruleName: { type: String, required: true },
    ruleType: { type: String, enum: Object.values(CommissionRuleType), required: true },
    
    targetType: { type: String, enum: Object.values(CommissionTargetType), required: true, index: true },
    targetId: { type: String, index: true },
    
    rate: { type: Number, min: 0 },
    
    minAmount: { type: Number, min: 0 },
    maxAmount: { type: Number, min: 0 },
    
    tiers: [commissionTierSchema],
    
    priority: { type: Number, required: true, default: 0 },
    
    validFrom: { type: Date },
    validTo: { type: Date },
    
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const CommissionRule = mongoose.model<ICommissionRule>('CommissionRule', commissionRuleSchema);
