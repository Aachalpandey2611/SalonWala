import mongoose, { Document, Schema } from 'mongoose';
import { NotificationType } from './NotificationChannel';

export interface INotificationTemplate extends Document {
  type: NotificationType;
  name: string;
  
  // Subject for emails
  subjectTemplate?: string;
  
  // Body for push/in-app/email
  bodyTemplate: string;
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const notificationTemplateSchema = new Schema<INotificationTemplate>(
  {
    type: { type: String, enum: Object.values(NotificationType), required: true, unique: true },
    name: { type: String, required: true },
    
    subjectTemplate: { type: String },
    bodyTemplate: { type: String, required: true },
    
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

export const NotificationTemplate = mongoose.model<INotificationTemplate>('NotificationTemplate', notificationTemplateSchema);
