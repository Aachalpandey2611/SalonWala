import mongoose, { Document, Schema } from 'mongoose';

export enum QueueStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
}

export interface IQueue extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  barberId: mongoose.Types.ObjectId;
  
  date: string; // YYYY-MM-DD
  status: QueueStatus;
  
  // Real-time tracking aggregations
  currentlyServingEntryId?: mongoose.Types.ObjectId;
  nextCustomerEntryId?: mongoose.Types.ObjectId;
  
  totalWaitingCustomers: number;
  averageWaitingTimeInMinutes: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const queueSchema = new Schema<IQueue>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true, index: true },
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true, index: true },
    
    date: { type: String, required: true },
    status: { type: String, enum: Object.values(QueueStatus), default: QueueStatus.ACTIVE },
    
    currentlyServingEntryId: { type: Schema.Types.ObjectId, ref: 'QueueEntry' },
    nextCustomerEntryId: { type: Schema.Types.ObjectId, ref: 'QueueEntry' },
    
    totalWaitingCustomers: { type: Number, default: 0 },
    averageWaitingTimeInMinutes: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// One active queue per barber per day
queueSchema.index({ barberId: 1, date: 1 }, { unique: true });

export const Queue = mongoose.model<IQueue>('Queue', queueSchema);
