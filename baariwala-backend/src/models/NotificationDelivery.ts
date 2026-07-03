import mongoose, { Document, Schema } from 'mongoose';
import { NotificationChannel } from './NotificationChannel';

export enum DeliveryStatus {
  QUEUED = 'QUEUED',
  PROCESSING = 'PROCESSING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export interface INotificationDelivery extends Document {
  recipientId: mongoose.Types.ObjectId;
  channel: NotificationChannel;
  
  targetAddress: string; // e.g., email address, FCM token, phone number
  
  subject?: string;
  body: string;
  
  status: DeliveryStatus;
  
  retryCount: number;
  maxRetries: number;
  
  failureReason?: string;
  
  deliveryTimestamp?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const notificationDeliverySchema = new Schema<INotificationDelivery>(
  {
    recipientId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    channel: { type: String, enum: Object.values(NotificationChannel), required: true, index: true },
    
    targetAddress: { type: String, required: true },
    
    subject: { type: String },
    body: { type: String, required: true },
    
    status: { type: String, enum: Object.values(DeliveryStatus), default: DeliveryStatus.QUEUED, index: true },
    
    retryCount: { type: Number, default: 0 },
    maxRetries: { type: Number, default: 3 },
    
    failureReason: { type: String },
    
    deliveryTimestamp: { type: Date },
  },
  {
    timestamps: true,
  }
);

export const NotificationDelivery = mongoose.model<INotificationDelivery>('NotificationDelivery', notificationDeliverySchema);
