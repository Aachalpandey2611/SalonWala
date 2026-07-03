import mongoose, { Document, Schema } from 'mongoose';

export interface INotificationPreference extends Document {
  userId: mongoose.Types.ObjectId;
  
  // Channels
  pushEnabled: boolean;
  emailEnabled: boolean;
  smsEnabled: boolean;
  
  // Categories
  marketingEnabled: boolean;
  bookingEnabled: boolean;
  reminderEnabled: boolean;
  queueEnabled: boolean;
  offerEnabled: boolean;
  systemEnabled: boolean;
  
  // DND
  dndEnabled: boolean;
  dndStartHour?: string; // e.g. "22:00"
  dndEndHour?: string;   // e.g. "07:00"
  
  createdAt: Date;
  updatedAt: Date;
}

const notificationPreferenceSchema = new Schema<INotificationPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    
    marketingEnabled: { type: Boolean, default: true },
    bookingEnabled: { type: Boolean, default: true },
    reminderEnabled: { type: Boolean, default: true },
    queueEnabled: { type: Boolean, default: true },
    offerEnabled: { type: Boolean, default: true },
    systemEnabled: { type: Boolean, default: true },
    
    dndEnabled: { type: Boolean, default: false },
    dndStartHour: { type: String },
    dndEndHour: { type: String },
  },
  {
    timestamps: true,
  }
);

export const NotificationPreference = mongoose.model<INotificationPreference>('NotificationPreference', notificationPreferenceSchema);
