import mongoose, { Document, Schema } from 'mongoose';

export interface IEventRetryQueue extends Document {
  eventId: mongoose.Types.ObjectId; // Ref to Event
  subscriberId: string;
  
  retryCount: number;
  maxRetries: number;
  
  nextRetryAt: Date;
  
  lastErrorMessage?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const eventRetryQueueSchema = new Schema<IEventRetryQueue>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    subscriberId: { type: String, required: true, index: true },
    
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    
    nextRetryAt: { type: Date, required: true, index: true }, // Index for fast polling
    
    lastErrorMessage: { type: String },
  },
  {
    timestamps: true,
  }
);

export const EventRetryQueue = mongoose.model<IEventRetryQueue>('EventRetryQueue', eventRetryQueueSchema);
