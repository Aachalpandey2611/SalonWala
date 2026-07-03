import mongoose, { Document, Schema } from 'mongoose';

export enum BreakType {
  LUNCH = 'LUNCH',
  TEA = 'TEA',
  PRAYER = 'PRAYER',
  PERSONAL = 'PERSONAL',
  EMERGENCY = 'EMERGENCY',
}

export interface IBarberBreak extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  type: BreakType;
  
  // Is this a recurring break every day?
  isRecurring: boolean;
  
  // If specific date
  date?: Date;
  
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  
  // Number of minutes blocked
  durationInMinutes: number;
  
  notes?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const barberBreakSchema = new Schema<IBarberBreak>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    type: { type: String, enum: Object.values(BreakType), required: true },
    
    isRecurring: { type: Boolean, default: false },
    date: { type: Date },
    
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    
    durationInMinutes: { type: Number, required: true, min: 1 },
    
    notes: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

export const BarberBreak = mongoose.model<IBarberBreak>('BarberBreak', barberBreakSchema);
