import mongoose, { Document, Schema } from 'mongoose';

export interface IQueueHistory extends Document {
  queueEntryId: mongoose.Types.ObjectId;
  queueId: mongoose.Types.ObjectId;
  
  previousStatus: string;
  newStatus: string;
  
  action: string; // e.g. "SKIPPED_DUE_TO_LATE_ARRIVAL", "CALLED"
  actorId?: mongoose.Types.ObjectId; // Who did it (System, Admin, Barber)
  
  createdAt: Date;
}

const queueHistorySchema = new Schema<IQueueHistory>(
  {
    queueEntryId: { type: Schema.Types.ObjectId, ref: 'QueueEntry', required: true, index: true },
    queueId: { type: Schema.Types.ObjectId, ref: 'Queue', required: true, index: true },
    
    previousStatus: { type: String, required: true },
    newStatus: { type: String, required: true },
    
    action: { type: String, required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const QueueHistory = mongoose.model<IQueueHistory>('QueueHistory', queueHistorySchema);
