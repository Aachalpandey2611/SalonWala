import mongoose, { Document, Schema } from 'mongoose';

export enum OvertimeType {
  PAID = 'PAID',
  COMPENSATORY = 'COMPENSATORY'
}

export enum OvertimeStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface IOvertime extends Document {
  salonId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  attendanceId: mongoose.Types.ObjectId; // Link to the specific day's attendance
  
  date: string; // YYYY-MM-DD
  
  overtimeMinutes: number;
  type: OvertimeType;
  
  status: OvertimeStatus;
  
  approvedBy?: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const overtimeSchema = new Schema<IOvertime>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    attendanceId: { type: Schema.Types.ObjectId, ref: 'Attendance', required: true },
    
    date: { type: String, required: true },
    
    overtimeMinutes: { type: Number, required: true },
    type: { type: String, enum: Object.values(OvertimeType), required: true },
    
    status: { type: String, enum: Object.values(OvertimeStatus), default: OvertimeStatus.PENDING, index: true },
    
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  }
);

export const Overtime = mongoose.model<IOvertime>('Overtime', overtimeSchema);
