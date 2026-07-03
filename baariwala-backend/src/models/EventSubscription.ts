import mongoose, { Document, Schema } from 'mongoose';

export interface IEventSubscription extends Document {
  subscriberId: string; // e.g., 'NotificationService'
  eventType: string;    // e.g., 'AppointmentCreated'
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const eventSubscriptionSchema = new Schema<IEventSubscription>(
  {
    subscriberId: { type: String, required: true, index: true },
    eventType: { type: String, required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// A subscriber should only register once per eventType
eventSubscriptionSchema.index({ subscriberId: 1, eventType: 1 }, { unique: true });

export const EventSubscription = mongoose.model<IEventSubscription>('EventSubscription', eventSubscriptionSchema);
