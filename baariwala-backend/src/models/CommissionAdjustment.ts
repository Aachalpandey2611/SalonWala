import mongoose, { Document, Schema } from 'mongoose';

export enum AdjustmentType {
  BONUS = 'BONUS',
  DEDUCTION = 'DEDUCTION'
}

export interface ICommissionAdjustment extends Document {
  commissionId: mongoose.Types.ObjectId;
  
  adjustmentType: AdjustmentType;
  amount: number;
  
  reason: string;
  adjustedBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const commissionAdjustmentSchema = new Schema<ICommissionAdjustment>(
  {
    commissionId: { type: Schema.Types.ObjectId, ref: 'Commission', required: true, index: true },
    
    adjustmentType: { type: String, enum: Object.values(AdjustmentType), required: true },
    amount: { type: Number, required: true, min: 0 },
    
    reason: { type: String, required: true },
    adjustedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export const CommissionAdjustment = mongoose.model<ICommissionAdjustment>('CommissionAdjustment', commissionAdjustmentSchema);
