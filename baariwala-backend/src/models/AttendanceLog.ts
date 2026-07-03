import mongoose, { Document, Schema } from 'mongoose';

export enum CheckInMethod {
  QR_CODE = 'QR_CODE',
  PIN = 'PIN',
  MOBILE_APP = 'MOBILE_APP',
  OWNER_APPROVAL = 'OWNER_APPROVAL',
  MANUAL_ENTRY = 'MANUAL_ENTRY',
  BIOMETRIC = 'BIOMETRIC',
  FACE_RECOGNITION = 'FACE_RECOGNITION'
}

export enum LogType {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT'
}

export interface IAttendanceLog extends Document {
  attendanceId: mongoose.Types.ObjectId;
  employeeId: mongoose.Types.ObjectId;
  
  type: LogType;
  timestamp: Date;
  
  method: CheckInMethod;
  device?: string;
  location?: {
    lat: number;
    lng: number;
  };
  
  createdAt: Date;
}

const attendanceLogSchema = new Schema<IAttendanceLog>(
  {
    attendanceId: { type: Schema.Types.ObjectId, ref: 'Attendance', required: true, index: true },
    employeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    type: { type: String, enum: Object.values(LogType), required: true },
    timestamp: { type: Date, required: true },
    
    method: { type: String, enum: Object.values(CheckInMethod), required: true },
    device: { type: String },
    location: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AttendanceLog = mongoose.model<IAttendanceLog>('AttendanceLog', attendanceLogSchema);
