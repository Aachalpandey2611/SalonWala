import mongoose, { Document, Schema } from 'mongoose';

export enum PayrollCycleType {
  WEEKLY = 'WEEKLY',
  BI_WEEKLY = 'BI_WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  CUSTOM = 'CUSTOM'
}

export enum PayrollCycleStatus {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  LOCKED = 'LOCKED'
}

export interface IPayrollCycle extends Document {
  salonId: mongoose.Types.ObjectId;
  
  name: string; // e.g. "May 2026 Monthly"
  cycleType: PayrollCycleType;
  
  startDate: Date;
  endDate: Date;
  
  paymentDate?: Date;
  approvalDate?: Date;
  
  status: PayrollCycleStatus;
  
  createdAt: Date;
  updatedAt: Date;
}

const payrollCycleSchema = new Schema<IPayrollCycle>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    name: { type: String, required: true },
    cycleType: { type: String, enum: Object.values(PayrollCycleType), required: true },
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    paymentDate: { type: Date },
    approvalDate: { type: Date },
    
    status: { type: String, enum: Object.values(PayrollCycleStatus), default: PayrollCycleStatus.DRAFT, index: true },
  },
  {
    timestamps: true,
  }
);

export const PayrollCycle = mongoose.model<IPayrollCycle>('PayrollCycle', payrollCycleSchema);
