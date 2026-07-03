import mongoose, { Document, Schema } from 'mongoose';

export enum BatchStatus {
  GENERATED = 'GENERATED',
  APPROVED = 'APPROVED',
  PROCESSED = 'PROCESSED'
}

export interface ISettlementBatch extends Document {
  batchId: string;
  totalSettlements: number;
  totalGrossAmount: number;
  totalNetAmount: number;
  
  status: BatchStatus;
  processedBy?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const settlementBatchSchema = new Schema<ISettlementBatch>(
  {
    batchId: { type: String, required: true, unique: true, index: true },
    
    totalSettlements: { type: Number, required: true, default: 0 },
    totalGrossAmount: { type: Number, required: true, default: 0 },
    totalNetAmount: { type: Number, required: true, default: 0 },
    
    status: { type: String, enum: Object.values(BatchStatus), default: BatchStatus.GENERATED, index: true },
    processedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

export const SettlementBatch = mongoose.model<ISettlementBatch>('SettlementBatch', settlementBatchSchema);
