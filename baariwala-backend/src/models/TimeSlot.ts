import mongoose, { Document, Schema } from 'mongoose';

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  LOCKED = 'LOCKED', // Temporarily locked while user is booking
  BOOKED = 'BOOKED',
  BLOCKED = 'BLOCKED', // Blocked due to break/leave/holiday
}

export interface ITimeSlot extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  date: Date; // The specific date (e.g. 2023-11-20)
  
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  
  status: SlotStatus;
  
  // To track who locked it temporarily (Session ID or User ID)
  lockedBy?: string;
  lockedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const timeSlotSchema = new Schema<ITimeSlot>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    date: { type: Date, required: true },
    
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    
    status: { type: String, enum: Object.values(SlotStatus), default: SlotStatus.AVAILABLE },
    
    lockedBy: { type: String },
    lockedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate exact slots for the same barber
timeSlotSchema.index({ barberId: 1, date: 1, startTime: 1 }, { unique: true });

export const TimeSlot = mongoose.model<ITimeSlot>('TimeSlot', timeSlotSchema);
