import mongoose, { Document, Schema } from 'mongoose';

export enum AttendanceStatus {
  FULL_DAY = 'FULL_DAY',
  HALF_DAY = 'HALF_DAY',
  LATE_CHECKIN = 'LATE_CHECKIN',
  EARLY_CHECKOUT = 'EARLY_CHECKOUT',
  ABSENT = 'ABSENT',
  HOLIDAY = 'HOLIDAY',
  WEEKLY_OFF = 'WEEKLY_OFF',
  PAID_LEAVE = 'PAID_LEAVE',
  UNPAID_LEAVE = 'UNPAID_LEAVE',
  SICK_LEAVE = 'SICK_LEAVE',
  EMERGENCY_LEAVE = 'EMERGENCY_LEAVE',
  WORK_FROM_ANOTHER_BRANCH = 'WORK_FROM_ANOTHER_BRANCH',
  TRAINING = 'TRAINING'
}

export interface IAttendance extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  date: string; // YYYY-MM-DD for deterministic uniqueness
  shiftId?: mongoose.Types.ObjectId;
  
  firstCheckIn?: Date;
  lastCheckOut?: Date;
  
  totalWorkMinutes: number;
  totalBreakMinutes: number;
  
  status: AttendanceStatus;
  
  isProcessed: boolean; // Flag if consumed by Payroll
  
  createdAt: Date;
  updatedAt: Date;
}

const attendanceSchema = new Schema<IAttendance>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, required: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    date: { type: String, required: true },
    shiftId: { type: Schema.Types.ObjectId, ref: 'AttendanceShift' },
    
    firstCheckIn: { type: Date },
    lastCheckOut: { type: Date },
    
    totalWorkMinutes: { type: Number, default: 0 },
    totalBreakMinutes: { type: Number, default: 0 },
    
    status: { type: String, enum: Object.values(AttendanceStatus), required: true, index: true },
    
    isProcessed: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

// One employee has exactly one attendance record per day
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const Attendance = mongoose.model<IAttendance>('Attendance', attendanceSchema);
