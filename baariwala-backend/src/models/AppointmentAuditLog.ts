import mongoose, { Document, Schema } from 'mongoose';

export enum AuditAction {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  RESTORED = 'RESTORED',
  CANCELLED = 'CANCELLED',
}

export interface IAppointmentAuditLog extends Document {
  appointmentId: mongoose.Types.ObjectId;
  bookingNumber: string; // Stored separately in case appointment is hard deleted
  
  action: AuditAction;
  performedBy: mongoose.Types.ObjectId; // User ID
  
  reason?: string;
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
}

const appointmentAuditLogSchema = new Schema<IAppointmentAuditLog>(
  {
    appointmentId: { type: Schema.Types.ObjectId, required: true, index: true },
    bookingNumber: { type: String, required: true },
    
    action: { type: String, enum: Object.values(AuditAction), required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    reason: { type: String, trim: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AppointmentAuditLog = mongoose.model<IAppointmentAuditLog>('AppointmentAuditLog', appointmentAuditLogSchema);
