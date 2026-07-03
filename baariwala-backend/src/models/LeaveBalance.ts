import mongoose, { Document, Schema } from 'mongoose';

export enum LeaveType {
  CASUAL = 'CASUAL',
  SICK = 'SICK',
  EMERGENCY = 'EMERGENCY',
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  MATERNITY = 'MATERNITY',
  PATERNITY = 'PATERNITY',
  COMPENSATORY = 'COMPENSATORY'
}

export interface ILeaveBalance extends Document {
  salonId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  leaveType: LeaveType;
  
  annualLimit: number;
  used: number;
  balance: number;
  
  year: number; // e.g., 2026
  
  createdAt: Date;
  updatedAt: Date;
}

const leaveBalanceSchema = new Schema<ILeaveBalance>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    leaveType: { type: String, enum: Object.values(LeaveType), required: true },
    
    annualLimit: { type: Number, required: true },
    used: { type: Number, default: 0 },
    balance: { type: Number, required: true },
    
    year: { type: Number, required: true }
  },
  {
    timestamps: true,
  }
);

leaveBalanceSchema.index({ employeeId: 1, leaveType: 1, year: 1 }, { unique: true });

export const LeaveBalance = mongoose.model<ILeaveBalance>('LeaveBalance', leaveBalanceSchema);
