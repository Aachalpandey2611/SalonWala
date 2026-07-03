import mongoose, { Document, Schema } from 'mongoose';

export interface IAppointmentNotes extends Document {
  appointmentId: mongoose.Types.ObjectId;
  
  customerNotes?: string;
  salonNotes?: string; // Internal notes not visible to customer
  
  hairPreferences?: string;
  specialInstructions?: string;
  allergies?: string;
  sensitiveSkin?: boolean;
  
  otherNotes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const appointmentNotesSchema = new Schema<IAppointmentNotes>(
  {
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment', required: true, index: true },
    
    customerNotes: { type: String, trim: true, maxlength: 1000 },
    salonNotes: { type: String, trim: true, maxlength: 1000 },
    
    hairPreferences: { type: String, trim: true, maxlength: 500 },
    specialInstructions: { type: String, trim: true, maxlength: 500 },
    allergies: { type: String, trim: true, maxlength: 200 },
    sensitiveSkin: { type: Boolean, default: false },
    
    otherNotes: { type: String, trim: true, maxlength: 500 },
  },
  {
    timestamps: true,
  }
);

export const AppointmentNotes = mongoose.model<IAppointmentNotes>('AppointmentNotes', appointmentNotesSchema);
