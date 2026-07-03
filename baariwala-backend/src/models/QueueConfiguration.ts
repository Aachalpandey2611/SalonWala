import mongoose, { Document, Schema } from 'mongoose';

export interface IQueueConfiguration extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  
  lateGracePeriodInMinutes: number; // e.g. 15 mins
  holdBookingIfLate: boolean; // if false, auto skip. if true, freeze queue position or move to PAUSED
  
  maxQueueSizePerBarber?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const queueConfigurationSchema = new Schema<IQueueConfiguration>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, unique: true }, // One config per branch
    
    lateGracePeriodInMinutes: { type: Number, default: 15, min: 0 },
    holdBookingIfLate: { type: Boolean, default: false },
    
    maxQueueSizePerBarber: { type: Number },
  },
  {
    timestamps: true,
  }
);

export const QueueConfiguration = mongoose.model<IQueueConfiguration>('QueueConfiguration', queueConfigurationSchema);
