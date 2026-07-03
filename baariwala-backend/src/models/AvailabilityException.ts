import mongoose, { Document, Schema } from 'mongoose';

export enum ExceptionType {
  FORCE_AVAILABLE = 'FORCE_AVAILABLE',
  FORCE_UNAVAILABLE = 'FORCE_UNAVAILABLE',
}

export interface IAvailabilityException extends Document {
  barberId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId; // Optional if forced unavailable globally
  
  type: ExceptionType;
  
  startTime: Date;
  endTime: Date;
  
  reason: string;
  createdBy: mongoose.Types.ObjectId; // User ID
  
  createdAt: Date;
  updatedAt: Date;
}

const availabilityExceptionSchema = new Schema<IAvailabilityException>(
  {
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch' },
    
    type: { type: String, enum: Object.values(ExceptionType), required: true },
    
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    
    reason: { type: String, required: true, trim: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
  }
);

export const AvailabilityException = mongoose.model<IAvailabilityException>('AvailabilityException', availabilityExceptionSchema);
