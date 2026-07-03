import mongoose, { Document, Schema } from 'mongoose';
import { DayOfWeek } from './BusinessHours'; // Re-use from Salon Management

export interface IBarberWorkingHours extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  day: DayOfWeek;
  isOff: boolean;
  
  // E.g. [{ startTime: '09:00', endTime: '13:00' }, { startTime: '14:00', endTime: '19:00' }]
  // This naturally supports split shifts and implicit lunch breaks
  sessions: {
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
  }[];
  
  createdAt: Date;
  updatedAt: Date;
}

const barberWorkingHoursSchema = new Schema<IBarberWorkingHours>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    day: { type: String, enum: Object.values(DayOfWeek), required: true },
    isOff: { type: Boolean, default: false },
    
    sessions: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }],
  },
  {
    timestamps: true,
  }
);

// One schedule per day per barber per branch
barberWorkingHoursSchema.index({ barberId: 1, branchId: 1, day: 1 }, { unique: true });

export const BarberWorkingHours = mongoose.model<IBarberWorkingHours>('BarberWorkingHours', barberWorkingHoursSchema);
