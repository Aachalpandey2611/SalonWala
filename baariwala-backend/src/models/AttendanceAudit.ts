import mongoose, { Document, Schema } from 'mongoose';

export enum AttendanceAuditAction {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  MANUAL_CORRECTION = 'MANUAL_CORRECTION',
  SHIFT_ASSIGNED = 'SHIFT_ASSIGNED',
  LEAVE_APPROVED = 'LEAVE_APPROVED',
  OVERTIME_APPROVED = 'OVERTIME_APPROVED'
}

export interface IAttendanceAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  
  action: AttendanceAuditAction;
  
  performedBy: mongoose.Types.ObjectId; // User ID
  targetEmployeeId: mongoose.Types.ObjectId;
  
  targetId?: mongoose.Types.ObjectId; // Attendance ID, Leave ID, etc.
  
  details: any; // JSON payload
  
  createdAt: Date;
}

const attendanceAuditSchema = new Schema<IAttendanceAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    action: { type: String, enum: Object.values(AttendanceAuditAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetEmployeeId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    targetId: { type: Schema.Types.ObjectId },
    
    details: { type: Schema.Types.Mixed },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AttendanceAudit = mongoose.model<IAttendanceAudit>('AttendanceAudit', attendanceAuditSchema);
