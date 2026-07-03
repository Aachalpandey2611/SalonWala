import mongoose, { Document, Schema } from 'mongoose';

export enum TenantStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  PENDING_VERIFICATION = 'PENDING_VERIFICATION',
  ARCHIVED = 'ARCHIVED'
}

export interface ITenant extends Document {
  name: string; // The primary global name for the tenant (e.g. "Tony's Salons SaaS Account")
  
  ownerId: mongoose.Types.ObjectId; // User ID of the primary owner who pays the SaaS bill
  
  contactEmail: string;
  contactPhone?: string;
  
  status: TenantStatus;
  
  lastActiveAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    contactEmail: { type: String, required: true },
    contactPhone: { type: String },
    
    status: { type: String, enum: Object.values(TenantStatus), default: TenantStatus.PENDING_VERIFICATION, index: true },
    
    lastActiveAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
