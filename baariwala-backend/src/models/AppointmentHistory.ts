import mongoose, { Document, Schema } from 'mongoose';

export enum AppointmentAction {
  CREATED = 'CREATED',
  STATUS_UPDATED = 'STATUS_UPDATED',
  RESCHEDULED = 'RESCHEDULED',
  SERVICES_UPDATED = 'SERVICES_UPDATED',
  NOTES_UPDATED = 'NOTES_UPDATED',
  CANCELLED = 'CANCELLED',
  RESTORED = 'RESTORED',
}

export interface IAppointmentHistory extends Document {
  appointmentId: mongoose.Types.ObjectId;
  action: AppointmentAction;
  
  performedBy: mongoose.Types.ObjectId; // User ID who made the change
  
  // Storing stringified JSON diffs
  oldValue?: string; 
  newValue?: string;
  
  reason?: string;
  
  createdAt: Date;
}

const appointmentHistorySchema = new Schema<IAppointmentHistory>(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
    action: { type: String, enum: Object.values(AppointmentAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    oldValue: { type: String },
    newValue: { type: String },
    
    reason: { type: String, trim: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // History is immutable
  }
);

export const AppointmentHistory = mongoose.model<IAppointmentHistory>('AppointmentHistory', appointmentHistorySchema);
