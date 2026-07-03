import mongoose, { Document, Schema } from 'mongoose';

export enum SubscriptionPlan {
  FREE_TRIAL = 'FREE_TRIAL',
  STARTER = 'STARTER',
  PROFESSIONAL = 'PROFESSIONAL',
  BUSINESS = 'BUSINESS',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  PAST_DUE = 'PAST_DUE',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED'
}

export interface ITenantSubscription extends Document {
  tenantId: mongoose.Types.ObjectId; // Strict Tenant Isolation
  
  planName: SubscriptionPlan;
  status: SubscriptionStatus;
  
  billingCycle: string; // 'MONTHLY', 'ANNUALLY'
  renewalDate: Date;
  
  // SaaS Usage Limits
  limits: {
    maxUsers: number; // e.g. 10 Barbers
    maxBranches: number; // e.g. 2 Branches for Starter, Unlimited for Enterprise
    storageLimitMb: number; // e.g. 5000 MB for images
    apiRateLimit: number; // requests per minute
  };
  
  // Usage Tracking
  currentUsage: {
    activeUsers: number;
    activeBranches: number;
    storageUsedMb: number;
  };
  
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const tenantSubscriptionSchema = new Schema<ITenantSubscription>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, unique: true },
    
    planName: { type: String, enum: Object.values(SubscriptionPlan), required: true },
    status: { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.ACTIVE, index: true },
    
    billingCycle: { type: String, required: true, default: 'MONTHLY' },
    renewalDate: { type: Date, required: true },
    
    limits: {
      maxUsers: { type: Number, required: true },
      maxBranches: { type: Number, required: true },
      storageLimitMb: { type: Number, required: true },
      apiRateLimit: { type: Number, required: true }
    },
    
    currentUsage: {
      activeUsers: { type: Number, default: 0 },
      activeBranches: { type: Number, default: 0 },
      storageUsedMb: { type: Number, default: 0 }
    },
    
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String }
  },
  {
    timestamps: true,
  }
);

export const TenantSubscription = mongoose.model<ITenantSubscription>('TenantSubscription', tenantSubscriptionSchema);
