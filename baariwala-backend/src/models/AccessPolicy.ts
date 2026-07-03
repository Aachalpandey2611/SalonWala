import mongoose, { Document, Schema } from 'mongoose';

export enum PolicyCondition {
  TIME_BASED = 'TIME_BASED', // e.g. Only access during 9 AM - 5 PM
  IP_RESTRICTION = 'IP_RESTRICTION', // Architecture ready
  READ_ONLY = 'READ_ONLY',
  TEMPORARY = 'TEMPORARY' // Expires after a date
}

export interface IAccessPolicy extends Document {
  tenantId?: mongoose.Types.ObjectId;
  roleId: mongoose.Types.ObjectId;
  
  condition: PolicyCondition;
  
  // Specific constraints
  timeRange?: { startHour: number, endHour: number };
  allowedIps?: string[];
  expiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const accessPolicySchema = new Schema<IAccessPolicy>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true, index: true },
    
    condition: { type: String, enum: Object.values(PolicyCondition), required: true },
    
    timeRange: {
      startHour: { type: Number },
      endHour: { type: Number }
    },
    allowedIps: [{ type: String }],
    expiresAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

export const AccessPolicy = mongoose.model<IAccessPolicy>('AccessPolicy', accessPolicySchema);
