import mongoose, { Document, Schema } from 'mongoose';

export interface IAuditRetentionPolicy extends Document {
  tenantId?: mongoose.Types.ObjectId;
  
  retainLogsDays: number; // e.g. 90 days
  retainLoginHistoryDays: number; // e.g. 30 days
  retainSecurityEventsDays: number; // e.g. 365 days
  
  updatedBy: mongoose.Types.ObjectId;
}

const auditRetentionPolicySchema = new Schema<IAuditRetentionPolicy>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', unique: true, sparse: true },
    
    retainLogsDays: { type: Number, default: 90 },
    retainLoginHistoryDays: { type: Number, default: 30 },
    retainSecurityEventsDays: { type: Number, default: 365 },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

export const AuditRetentionPolicy = mongoose.model<IAuditRetentionPolicy>('AuditRetentionPolicy', auditRetentionPolicySchema);
