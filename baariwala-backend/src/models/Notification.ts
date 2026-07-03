import mongoose, { Document, Schema } from 'mongoose';
import { NotificationType } from './NotificationChannel';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: NotificationType;
  
  title: string;
  message: string;
  
  isRead: boolean;
  readAt?: Date;
  
  // Link to specific entity (e.g., Appointment ID)
  referenceId?: string;
  referenceModel?: string; // 'Appointment', 'Queue'
  
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, enum: Object.values(NotificationType), required: true, index: true },
    
    title: { type: String, required: true },
    message: { type: String, required: true },
    
    isRead: { type: Boolean, default: false, index: true },
    readAt: { type: Date },
    
    referenceId: { type: String },
    referenceModel: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
