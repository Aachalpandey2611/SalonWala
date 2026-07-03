import mongoose, { Document, Schema } from 'mongoose';

export enum ShiftType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
  SPLIT = 'SPLIT',
  FLEXIBLE = 'FLEXIBLE',
  TEMPORARY = 'TEMPORARY',
  HOLIDAY = 'HOLIDAY'
}

export interface IAttendanceShift extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  name: string;
  shiftType: ShiftType;
  
  startTime: string; // HH:mm (e.g. 09:00)
  endTime: string; // HH:mm (e.g. 17:00)
  
  gracePeriodMinutes: number; // e.g. 15 mins late allowed
  halfDayThresholdMinutes: number; // e.g. working less than 4 hours = half day
  
  totalBreakMinutes: number;
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const attendanceShiftSchema = new Schema<IAttendanceShift>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    
    name: { type: String, required: true },
    shiftType: { type: String, enum: Object.values(ShiftType), required: true },
    
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    
    gracePeriodMinutes: { type: Number, default: 15 },
    halfDayThresholdMinutes: { type: Number, default: 240 }, // 4 hours
    
    totalBreakMinutes: { type: Number, default: 60 },
    
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

export const AttendanceShift = mongoose.model<IAttendanceShift>('AttendanceShift', attendanceShiftSchema);
