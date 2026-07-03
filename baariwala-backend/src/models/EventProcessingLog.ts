import mongoose, { Document, Schema } from 'mongoose';

export enum ProcessingStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
}

export interface IEventProcessingLog extends Document {
  eventId: mongoose.Types.ObjectId; // Ref to Event
  subscriberId: string;
  status: ProcessingStatus;
  
  // If failed, why?
  errorMessage?: string;
  errorStack?: string;
  
  processingTimeMs: number;
  
  createdAt: Date;
}

const eventProcessingLogSchema = new Schema<IEventProcessingLog>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
    subscriberId: { type: String, required: true, index: true },
    status: { type: String, enum: Object.values(ProcessingStatus), required: true },
    
    errorMessage: { type: String },
    errorStack: { type: String },
    
    processingTimeMs: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const EventProcessingLog = mongoose.model<IEventProcessingLog>('EventProcessingLog', eventProcessingLogSchema);
