import mongoose, { Document, Schema } from 'mongoose';

export enum ComplianceType {
  DATA_EXPORT = 'DATA_EXPORT',
  DATA_DELETION = 'DATA_DELETION',
  PRIVACY_CONSENT = 'PRIVACY_CONSENT'
}

export interface IComplianceRecord extends Document {
  tenantId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  type: ComplianceType;
  
  description: string;
  ipAddress: string;
  
  fulfilled: boolean;
  fulfilledAt?: Date;
  
  createdAt: Date;
}

const complianceRecordSchema = new Schema<IComplianceRecord>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    type: { type: String, enum: Object.values(ComplianceType), required: true },
    description: { type: String, required: true },
    ipAddress: { type: String, required: true },
    
    fulfilled: { type: Boolean, default: false },
    fulfilledAt: { type: Date }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ComplianceRecord = mongoose.model<IComplianceRecord>('ComplianceRecord', complianceRecordSchema);
