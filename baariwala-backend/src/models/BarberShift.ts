import mongoose, { Document, Schema } from 'mongoose';

export enum ShiftType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  FULL_DAY = 'FULL_DAY',
  SPLIT_SHIFT = 'SPLIT_SHIFT',
  TEMPORARY = 'TEMPORARY',
  HOLIDAY_SHIFT = 'HOLIDAY_SHIFT',
  EMERGENCY_SHIFT = 'EMERGENCY_SHIFT',
}

export interface IBarberShift extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  type: ShiftType;
  
  // For specific date overrides (e.g., Temporary/Holiday/Emergency Shift)
  // If null, it's a permanent assignment shift definition (used with WorkingHours)
  effectiveDate?: Date;
  expiryDate?: Date;
  
  // Sessions in this shift
  sessions: {
    startTime: string; // HH:MM
    endTime: string;   // HH:MM
  }[];
  
  notes?: string;
  assignedBy: mongoose.Types.ObjectId; // User ID
  
  createdAt: Date;
  updatedAt: Date;
}

const barberShiftSchema = new Schema<IBarberShift>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    type: { type: String, enum: Object.values(ShiftType), required: true },
    
    effectiveDate: { type: Date },
    expiryDate: { type: Date },
    
    sessions: [{
      startTime: { type: String, required: true },
      endTime: { type: String, required: true }
    }],
    
    notes: { type: String, trim: true },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export const BarberShift = mongoose.model<IBarberShift>('BarberShift', barberShiftSchema);
