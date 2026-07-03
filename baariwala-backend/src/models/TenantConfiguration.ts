import mongoose, { Document, Schema } from 'mongoose';

export interface ITenantConfiguration extends Document {
  tenantId: mongoose.Types.ObjectId; // Strict Tenant Isolation
  
  currency: string; // e.g. 'USD', 'INR'
  timezone: string; // e.g. 'America/Los_Angeles', 'Asia/Kolkata'
  language: string; // e.g. 'en', 'es'
  
  taxSettings: {
    taxLabel?: string; // e.g. 'GST', 'VAT'
    defaultTaxRate?: number;
    isTaxInclusive: boolean;
  };
  
  bookingRules: {
    maxAdvanceBookingDays: number;
    cancellationWindowHours: number;
  };
  
  notificationPreferences: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
  };
  
  featureFlags: {
    enableWaitlist: boolean;
    enableLoyalty: boolean;
    enableMemberships: boolean;
    enableAIInsights: boolean; // Driven by subscription tier
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const tenantConfigSchema = new Schema<ITenantConfiguration>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, unique: true },
    
    currency: { type: String, default: 'USD' },
    timezone: { type: String, default: 'UTC' },
    language: { type: String, default: 'en' },
    
    taxSettings: {
      taxLabel: { type: String, default: 'Tax' },
      defaultTaxRate: { type: Number, default: 0 },
      isTaxInclusive: { type: Boolean, default: false }
    },
    
    bookingRules: {
      maxAdvanceBookingDays: { type: Number, default: 30 },
      cancellationWindowHours: { type: Number, default: 24 }
    },
    
    notificationPreferences: {
      emailEnabled: { type: Boolean, default: true },
      smsEnabled: { type: Boolean, default: false }, // Typically costs extra SaaS credits
      pushEnabled: { type: Boolean, default: true }
    },
    
    featureFlags: {
      enableWaitlist: { type: Boolean, default: true },
      enableLoyalty: { type: Boolean, default: false },
      enableMemberships: { type: Boolean, default: false },
      enableAIInsights: { type: Boolean, default: false } // Enterprise feature
    }
  },
  {
    timestamps: true,
  }
);

export const TenantConfiguration = mongoose.model<ITenantConfiguration>('TenantConfiguration', tenantConfigSchema);
