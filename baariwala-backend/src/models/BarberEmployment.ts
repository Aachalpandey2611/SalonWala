import mongoose, { Document, Schema } from 'mongoose';
import { BarberEmploymentStatus } from './Barber';

export interface IBarberEmployment extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  
  status: BarberEmploymentStatus;
  startDate: Date;
  endDate?: Date;
  
  reason?: string; // Reason for termination, suspension, etc.
  notes?: string;
  
  updatedBy: mongoose.Types.ObjectId; // User ID (Admin/Owner who made the change)
  createdAt: Date;
  updatedAt: Date;
}

const barberEmploymentSchema = new Schema<IBarberEmployment>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    status: { type: String, enum: Object.values(BarberEmploymentStatus), required: true },
    startDate: { type: Date, default: Date.now, required: true },
    endDate: { type: Date },
    
    reason: { type: String, trim: true },
    notes: { type: String, trim: true },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export const BarberEmployment = mongoose.model<IBarberEmployment>('BarberEmployment', barberEmploymentSchema);
