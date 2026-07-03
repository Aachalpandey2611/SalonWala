import mongoose, { Document, Schema } from 'mongoose';
import { PayrollCycleStatus } from './PayrollCycle';

export interface IPayrollHistory extends Document {
  payrollId: mongoose.Types.ObjectId;
  
  previousStatus?: PayrollCycleStatus;
  newStatus: PayrollCycleStatus;
  
  notes?: string;
  initiatedBySystem: boolean;
  
  createdAt: Date;
}

const payrollHistorySchema = new Schema<IPayrollHistory>(
  {
    payrollId: { type: Schema.Types.ObjectId, ref: 'Payroll', required: true, index: true },
    
    previousStatus: { type: String, enum: Object.values(PayrollCycleStatus) },
    newStatus: { type: String, enum: Object.values(PayrollCycleStatus), required: true },
    
    notes: { type: String },
    initiatedBySystem: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const PayrollHistory = mongoose.model<IPayrollHistory>('PayrollHistory', payrollHistorySchema);
