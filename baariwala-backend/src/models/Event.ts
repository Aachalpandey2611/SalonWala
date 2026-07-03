import mongoose, { Document, Schema } from 'mongoose';

export enum EventStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  FAILED = 'FAILED',
}

export interface IEvent extends Document {
  eventId: string;          // UUID or unique string
  eventType: string;        // e.g., 'AppointmentCreated'
  producer: string;         // e.g., 'BookingEngine'
  payload: string;          // JSON string
  schemaVersion: number;    // default 1
  correlationId?: string;   // For tracing flows across modules
  status: EventStatus;
  retryCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    eventId: { type: String, required: true, unique: true, index: true },
    eventType: { type: String, required: true, index: true },
    producer: { type: String, required: true },
    payload: { type: String, required: true },
    schemaVersion: { type: Number, default: 1 },
    correlationId: { type: String, index: true },
    status: { type: String, enum: Object.values(EventStatus), default: EventStatus.PENDING, index: true },
    retryCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const EventModel = mongoose.model<IEvent>('Event', eventSchema);
