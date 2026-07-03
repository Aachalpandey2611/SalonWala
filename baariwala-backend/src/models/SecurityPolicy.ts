import mongoose, { Document, Schema } from 'mongoose';

export interface ISecurityPolicy extends Document {
  tenantId?: mongoose.Types.ObjectId; // Null means global override
  
  maxConcurrentSessions: number; // e.g. 3
  requireMFA: boolean; // Future-ready
  
  ipAllowlist: string[];
  ipBlocklist: string[];
  
  jwtExpiryMinutes: number;
  refreshTokenExpiryDays: number;
  
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const securityPolicySchema = new Schema<ISecurityPolicy>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', unique: true, sparse: true },
    
    maxConcurrentSessions: { type: Number, default: 5 },
    requireMFA: { type: Boolean, default: false },
    
    ipAllowlist: [{ type: String }],
    ipBlocklist: [{ type: String }],
    
    jwtExpiryMinutes: { type: Number, default: 60 },
    refreshTokenExpiryDays: { type: Number, default: 7 },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const SecurityPolicy = mongoose.model<ISecurityPolicy>('SecurityPolicy', securityPolicySchema);
