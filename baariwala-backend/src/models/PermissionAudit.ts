import mongoose, { Document, Schema } from 'mongoose';

export enum PermissionAuditAction {
  ROLE_CREATED = 'ROLE_CREATED',
  ROLE_UPDATED = 'ROLE_UPDATED',
  ROLE_ASSIGNED = 'ROLE_ASSIGNED',
  ROLE_REMOVED = 'ROLE_REMOVED',
  AUTHORIZATION_FAILED = 'AUTHORIZATION_FAILED',
  ELEVATED_LOGIN = 'ELEVATED_LOGIN'
}

export interface IPermissionAudit extends Document {
  tenantId?: mongoose.Types.ObjectId;
  
  action: PermissionAuditAction;
  performedBy: mongoose.Types.ObjectId;
  targetUserId?: mongoose.Types.ObjectId;
  
  details: any;
  
  ipAddress?: string;
  
  createdAt: Date;
}

const permissionAuditSchema = new Schema<IPermissionAudit>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    
    action: { type: String, enum: Object.values(PermissionAuditAction), required: true, index: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    
    details: { type: Schema.Types.Mixed },
    
    ipAddress: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

export const PermissionAudit = mongoose.model<IPermissionAudit>('PermissionAudit', permissionAuditSchema);
