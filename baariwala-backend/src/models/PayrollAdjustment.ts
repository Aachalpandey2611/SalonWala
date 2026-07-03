import mongoose, { Document, Schema } from 'mongoose';

export enum PayrollAdjustmentType {
  BONUS = 'BONUS',
  PENALTY = 'PENALTY',
  ADVANCE_RECOVERY = 'ADVANCE_RECOVERY',
  INCENTIVE = 'INCENTIVE'
}

export interface IPayrollAdjustment extends Document {
  payrollId: mongoose.Types.ObjectId;
  
  type: PayrollAdjustmentType;
  amount: number;
  reason: string;
  
  adjustedBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const payrollAdjustmentSchema = new Schema<IPayrollAdjustment>(
  {
    payrollId: { type: Schema.Types.ObjectId, ref: 'Payroll', required: true, index: true },
    
    type: { type: String, enum: Object.values(PayrollAdjustmentType), required: true },
    amount: { type: Number, required: true },
    reason: { type: String, required: true },
    
    adjustedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export const PayrollAdjustment = mongoose.model<IPayrollAdjustment>('PayrollAdjustment', payrollAdjustmentSchema);
