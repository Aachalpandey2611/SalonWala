import mongoose, { Document, Schema } from 'mongoose';

export enum LiveAvailabilityStatus {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  ON_BREAK = 'ON_BREAK',
  ON_LEAVE = 'ON_LEAVE',
  SHIFT_ENDED = 'SHIFT_ENDED',
  SALON_CLOSED = 'SALON_CLOSED',
  HOLIDAY = 'HOLIDAY',
  EMERGENCY_LEAVE = 'EMERGENCY_LEAVE',
}

export interface IBarberAvailability extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId; // Current branch
  
  status: LiveAvailabilityStatus;
  statusMessage?: string;
  
  // Future: Real-time tracking of current booking / break
  currentEntityId?: mongoose.Types.ObjectId; // e.g. Booking ID or Break ID
  expectedReturnTime?: Date;
  
  updatedAt: Date;
}

const barberAvailabilitySchema = new Schema<IBarberAvailability>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, unique: true }, // One global live status per barber
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    
    status: { type: String, enum: Object.values(LiveAvailabilityStatus), default: LiveAvailabilityStatus.AVAILABLE },
    statusMessage: { type: String, trim: true },
    
    currentEntityId: { type: Schema.Types.ObjectId },
    expectedReturnTime: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const BarberAvailability = mongoose.model<IBarberAvailability>('BarberAvailability', barberAvailabilitySchema);
