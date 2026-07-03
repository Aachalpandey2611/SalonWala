import mongoose, { Document, Schema } from 'mongoose';

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface IProcurementApproval extends Document {
  salonId: mongoose.Types.ObjectId;
  purchaseOrderId: mongoose.Types.ObjectId;
  
  requestedBy: mongoose.Types.ObjectId;
  
  // Chain of approvals (Manager -> Owner)
  managerId?: mongoose.Types.ObjectId;
  managerStatus: ApprovalStatus;
  
  ownerId?: mongoose.Types.ObjectId;
  ownerStatus: ApprovalStatus;
  
  rejectionReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const procurementApprovalSchema = new Schema<IProcurementApproval>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    purchaseOrderId: { type: Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true, index: true },
    
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    managerId: { type: Schema.Types.ObjectId, ref: 'User' },
    managerStatus: { type: String, enum: Object.values(ApprovalStatus), default: ApprovalStatus.PENDING },
    
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    ownerStatus: { type: String, enum: Object.values(ApprovalStatus), default: ApprovalStatus.PENDING },
    
    rejectionReason: { type: String }
  },
  {
    timestamps: true,
  }
);

export const ProcurementApproval = mongoose.model<IProcurementApproval>('ProcurementApproval', procurementApprovalSchema);
