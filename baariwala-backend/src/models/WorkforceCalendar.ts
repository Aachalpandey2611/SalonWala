import mongoose, { Document, Schema } from 'mongoose';

export interface IWorkforceCalendar extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  date: string; // YYYY-MM-DD
  
  shiftId?: mongoose.Types.ObjectId; // Pre-assigned shift
  isOnLeave: boolean;
  leaveId?: mongoose.Types.ObjectId;
  
  isHoliday: boolean;
  holidayName?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const workforceCalendarSchema = new Schema<IWorkforceCalendar>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    date: { type: String, required: true },
    
    shiftId: { type: Schema.Types.ObjectId, ref: 'AttendanceShift' },
    isOnLeave: { type: Boolean, default: false },
    leaveId: { type: Schema.Types.ObjectId, ref: 'LeaveRequest' },
    
    isHoliday: { type: Boolean, default: false },
    holidayName: { type: String }
  },
  {
    timestamps: true,
  }
);

// One entry per employee per day
workforceCalendarSchema.index({ employeeId: 1, date: 1 }, { unique: true });

export const WorkforceCalendar = mongoose.model<IWorkforceCalendar>('WorkforceCalendar', workforceCalendarSchema);
