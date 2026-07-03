import mongoose, { Document, Schema } from 'mongoose';
import { NotificationChannel } from './NotificationChannel';
import { DeliveryStatus } from './NotificationDelivery';

export interface ICommunicationLog extends Document {
  recipientId: mongoose.Types.ObjectId;
  channel: NotificationChannel;
  
  subject?: string;
  bodySnapshot: string;
  
  finalStatus: DeliveryStatus; // SENT, DELIVERED, or FAILED
  
  totalRetries: number;
  terminalFailureReason?: string;
  
  completedAt: Date;
  createdAt: Date;
}

const communicationLogSchema = new Schema<ICommunicationLog>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    channel: { type: String, enum: Object.values(NotificationChannel), required: true, index: true },
    
    subject: { type: String },
    bodySnapshot: { type: String, required: true },
    
    finalStatus: { type: String, enum: Object.values(DeliveryStatus), required: true },
    
    totalRetries: { type: Number, required: true },
    terminalFailureReason: { type: String },
    
    completedAt: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const CommunicationLog = mongoose.model<ICommunicationLog>('CommunicationLog', communicationLogSchema);
