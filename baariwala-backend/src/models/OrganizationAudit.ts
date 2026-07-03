import mongoose, { Document, Schema } from 'mongoose';

export enum OrgAuditAction {
  TENANT_CREATED = 'TENANT_CREATED',
  TENANT_SUSPENDED = 'TENANT_SUSPENDED',
  ORGANIZATION_CREATED = 'ORGANIZATION_CREATED',
  BRANCH_HIERARCHY_UPDATED = 'BRANCH_HIERARCHY_UPDATED',
  SUBSCRIPTION_UPGRADED = 'SUBSCRIPTION_UPGRADED',
  SUBSCRIPTION_DOWNGRADED = 'SUBSCRIPTION_DOWNGRADED',
  CONFIGURATION_CHANGED = 'CONFIGURATION_CHANGED'
}

export interface IOrganizationAudit extends Document {
  tenantId: mongoose.Types.ObjectId; // Strict Tenant Isolation
  
  action: OrgAuditAction;
  performedBy: mongoose.Types.ObjectId; // User ID (often SuperAdmin or Tenant Owner)
  
  details: any; // e.g. { previousPlan: 'STARTER', newPlan: 'PRO' }
  
  createdAt: Date;
}

const orgAuditSchema = new Schema<IOrganizationAudit>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    
    action: { type: String, enum: Object.values(OrgAuditAction), required: true, index: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable audit log
  }
);

export const OrganizationAudit = mongoose.model<IOrganizationAudit>('OrganizationAudit', orgAuditSchema);
