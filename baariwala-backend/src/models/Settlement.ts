import mongoose, { Document, Schema } from 'mongoose';

export enum SettlementStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ISettlement extends Document {
  salonId: mongoose.Types.ObjectId;
  settlementBatchId: mongoose.Types.ObjectId;
  
  periodStart: Date;
  periodEnd: Date;
  
  grossAmount: number; // Total processed payments
  platformFeeAmount: number;
  gatewayFeeAmount: number;
  taxAmount: number;
  netSettlementAmount: number; // Gross - Fees - Tax
  
  currency: string;
  status: SettlementStatus;
  
  bankReferenceId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const settlementSchema = new Schema<ISettlement>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    settlementBatchId: { type: Schema.Types.ObjectId, ref: 'SettlementBatch', required: true, index: true },
    
    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    
    grossAmount: { type: Number, required: true, min: 0 },
    platformFeeAmount: { type: Number, required: true, min: 0 },
    gatewayFeeAmount: { type: Number, required: true, min: 0 },
    taxAmount: { type: Number, required: true, min: 0 },
    netSettlementAmount: { type: Number, required: true },
    
    currency: { type: String, required: true, default: 'INR' },
    status: { type: String, enum: Object.values(SettlementStatus), default: SettlementStatus.PENDING, index: true },
    
    bankReferenceId: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Settlement = mongoose.model<ISettlement>('Settlement', settlementSchema);
