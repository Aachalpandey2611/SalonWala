import mongoose, { Document, Schema } from 'mongoose';
import { LeaveType } from './LeaveBalance';

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface ILeaveRequest extends Document {
  salonId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  leaveType: LeaveType;
  
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  
  totalDays: number;
  reason: string;
  
  status: LeaveStatus;
  
  approvedBy?: mongoose.Types.ObjectId;
  rejectionReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const leaveRequestSchema = new Schema<ILeaveRequest>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    leaveType: { type: String, enum: Object.values(LeaveType), required: true },
    
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    
    totalDays: { type: Number, required: true },
    reason: { type: String, required: true },
    
    status: { type: String, enum: Object.values(LeaveStatus), default: LeaveStatus.PENDING, index: true },
    
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    rejectionReason: { type: String }
  },
  {
    timestamps: true,
  }
);

export const LeaveRequest = mongoose.model<ILeaveRequest>('LeaveRequest', leaveRequestSchema);
