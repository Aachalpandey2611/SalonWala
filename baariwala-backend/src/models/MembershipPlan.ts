import mongoose, { Document, Schema } from 'mongoose';

export enum MembershipTier {
  SILVER = 'SILVER',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export interface IMembershipPlan extends Document {
  name: string;
  description: string;
  tier: MembershipTier;
  
  price: number;
  billingCycle: BillingCycle;
  
  benefits: string[]; // E.g. ['FREE_HAIRCUT', '10_PERCENT_OFF_PRODUCTS', 'PRIORITY_BOOKING']
  
  isActive: boolean; // Admin can disable plans
  
  createdAt: Date;
  updatedAt: Date;
}

const membershipPlanSchema = new Schema<IMembershipPlan>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    tier: { type: String, enum: Object.values(MembershipTier), required: true, index: true },
    
    price: { type: Number, required: true, min: 0 },
    billingCycle: { type: String, enum: Object.values(BillingCycle), required: true },
    
    benefits: [{ type: String }],
    
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const MembershipPlan = mongoose.model<IMembershipPlan>('MembershipPlan', membershipPlanSchema);
