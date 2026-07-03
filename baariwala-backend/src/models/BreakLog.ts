import mongoose, { Document, Schema } from 'mongoose';

export enum BreakType {
  LUNCH = 'LUNCH',
  TEA = 'TEA',
  PERSONAL = 'PERSONAL',
  EMERGENCY = 'EMERGENCY'
}

export interface IBreakLog extends Document {
  attendanceId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  type: BreakType;
  
  startTime: Date;
  endTime?: Date;
  
  durationMinutes: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const breakLogSchema = new Schema<IBreakLog>(
  {
    attendanceId: { type: Schema.Types.ObjectId, ref: 'Attendance', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    type: { type: String, enum: Object.values(BreakType), required: true },
    
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    
    durationMinutes: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

export const BreakLog = mongoose.model<IBreakLog>('BreakLog', breakLogSchema);
