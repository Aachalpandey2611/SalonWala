import mongoose, { Document, Schema } from 'mongoose';

export enum LeaveType {
  CASUAL = 'CASUAL',
  MEDICAL = 'MEDICAL',
  EMERGENCY = 'EMERGENCY',
  VACATION = 'VACATION',
  FESTIVAL = 'FESTIVAL',
  HALF_DAY = 'HALF_DAY',
  WEEKLY_OFF = 'WEEKLY_OFF',
}

export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export interface IBarberLeave extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  
  type: LeaveType;
  status: LeaveStatus;
  
  startDate: Date;
  endDate: Date;
  
  // E.g. 1.0, 0.5, 3.0 days
  durationInDays: number;
  
  reason: string;
  
  // If a half-day, what time does it start/end? (Optional)
  halfDayStartTime?: string;
  halfDayEndTime?: string;
  
  approvedBy?: mongoose.Types.ObjectId; // User ID
  adminNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const barberLeaveSchema = new Schema<IBarberLeave>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    type: { type: String, enum: Object.values(LeaveType), required: true },
    status: { type: String, enum: Object.values(LeaveStatus), default: LeaveStatus.PENDING },
    
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    durationInDays: { type: Number, required: true, min: 0.5 },
    reason: { type: String, required: true, trim: true },
    
    halfDayStartTime: { type: String },
    halfDayEndTime: { type: String },
    
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    adminNotes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export const BarberLeave = mongoose.model<IBarberLeave>('BarberLeave', barberLeaveSchema);
