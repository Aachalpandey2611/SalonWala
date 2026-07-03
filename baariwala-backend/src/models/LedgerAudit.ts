import mongoose, { Document, Schema } from 'mongoose';

export enum AuditAction {
  CREATE = 'CREATE',
  REVERSE = 'REVERSE',
  FAIL = 'FAIL'
}

export interface ILedgerAudit extends Document {
  journalId?: mongoose.Types.ObjectId;
  action: AuditAction;
  
  initiatedBy?: mongoose.Types.ObjectId; // User ID
  initiatedBySystem: boolean;
  
  reason: string;
  metadata?: any;
  
  createdAt: Date;
}

const ledgerAuditSchema = new Schema<ILedgerAudit>(
  {
    journalId: { type: Schema.Types.ObjectId, ref: 'LedgerJournal', index: true },
    action: { type: String, enum: Object.values(AuditAction), required: true, index: true },
    
    initiatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    initiatedBySystem: { type: Boolean, default: false },
    
    reason: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable
  }
);

export const LedgerAudit = mongoose.model<ILedgerAudit>('LedgerAudit', ledgerAuditSchema);
