import mongoose, { Document, Schema } from 'mongoose';

export enum CommissionAuditAction {
  CONFIG_CREATED = 'CONFIG_CREATED',
  CONFIG_MODIFIED = 'CONFIG_MODIFIED',
  RULE_CREATED = 'RULE_CREATED',
  RULE_MODIFIED = 'RULE_MODIFIED',
  RULE_DELETED = 'RULE_DELETED'
}

export interface ICommissionAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  action: CommissionAuditAction;
  
  performedBy: mongoose.Types.ObjectId;
  
  targetId?: mongoose.Types.ObjectId; // E.g., Rule ID
  
  details: any; // JSON payload of changes
  
  createdAt: Date;
}

const commissionAuditSchema = new Schema<ICommissionAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    action: { type: String, enum: Object.values(CommissionAuditAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    targetId: { type: Schema.Types.ObjectId },
    
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CommissionAudit = mongoose.model<ICommissionAudit>('CommissionAudit', commissionAuditSchema);
