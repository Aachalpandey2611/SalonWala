import mongoose, { Document, Schema } from 'mongoose';

export enum ProcurementAuditAction {
  PO_CREATED = 'PO_CREATED',
  PO_APPROVED = 'PO_APPROVED',
  PO_REJECTED = 'PO_REJECTED',
  PO_CANCELLED = 'PO_CANCELLED',
  GRN_CREATED = 'GRN_CREATED',
  STOCK_TRANSFER_INITIATED = 'STOCK_TRANSFER_INITIATED',
  STOCK_TRANSFER_COMPLETED = 'STOCK_TRANSFER_COMPLETED',
  RETURN_PROCESSED = 'RETURN_PROCESSED'
}

export interface IProcurementAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  
  action: ProcurementAuditAction;
  
  performedBy: mongoose.Types.ObjectId;
  targetId: mongoose.Types.ObjectId; // E.g., PO ID or GRN ID
  
  details: any;
  
  createdAt: Date;
}

const procurementAuditSchema = new Schema<IProcurementAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    action: { type: String, enum: Object.values(ProcurementAuditAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId, required: true },
    
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ProcurementAudit = mongoose.model<IProcurementAudit>('ProcurementAudit', procurementAuditSchema);
