import mongoose, { Document, Schema } from 'mongoose';

export interface IDeadLetterQueue extends Document {
  eventId: mongoose.Types.ObjectId; // Ref to Event
  subscriberId: string;
  
  failureReason: string;
  totalRetryAttempts: number;
  
  payloadSnapshot: string; // The payload at the time it failed
  
  status: 'UNRESOLVED' | 'REPLAYED' | 'DISMISSED';
  
  createdAt: Date;
  updatedAt: Date;
}

const deadLetterQueueSchema = new Schema<IDeadLetterQueue>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    subscriberId: { type: String, required: true, index: true },
    
    failureReason: { type: String, required: true },
    totalRetryAttempts: { type: Number, required: true },
    
    payloadSnapshot: { type: String, required: true },
    
    status: { type: String, enum: ['UNRESOLVED', 'REPLAYED', 'DISMISSED'], default: 'UNRESOLVED', index: true },
  },
  {
    timestamps: true,
  }
);

export const DeadLetterQueue = mongoose.model<IDeadLetterQueue>('DeadLetterQueue', deadLetterQueueSchema);
