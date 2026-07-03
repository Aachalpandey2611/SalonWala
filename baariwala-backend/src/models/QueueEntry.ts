import mongoose, { Document, Schema } from 'mongoose';

export enum QueueEntryStatus {
  WAITING = 'WAITING',
  CALLED = 'CALLED',
  SKIPPED = 'SKIPPED',
  CHECKED_IN = 'CHECKED_IN',
  IN_SERVICE = 'IN_SERVICE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  PAUSED = 'PAUSED',
}

export enum QueuePriority {
  NORMAL = 1,
  MEMBERSHIP = 2,
  VIP = 3,
  STAFF_OVERRIDE = 4,
  EMERGENCY = 5,
  ADMIN_PRIORITY = 6,
}

export interface IQueueEntry extends Document {
  queueId: mongoose.Types.ObjectId;
  appointmentId?: mongoose.Types.ObjectId; // Might be null for strict Walk-ins if they don't generate appointments immediately
  customerId?: mongoose.Types.ObjectId;
  
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  barberId: mongoose.Types.ObjectId;
  
  queuePosition: number;
  tokenNumber: string; // E.g., A-101
  status: QueueEntryStatus;
  priorityLevel: QueuePriority;
  
  // Real-time calculated fields
  estimatedStartTime?: Date;
  estimatedEndTime?: Date;
  estimatedWaitingTimeInMinutes: number;
  
  actualWaitingTimeInMinutes?: number;
  
  source: string; // APP, WALK_IN, ADMIN
  
  createdAt: Date;
  updatedAt: Date;
}

const queueEntrySchema = new Schema<IQueueEntry>(
  {
    queueId: { type: Schema.Types.ObjectId, ref: 'Queue', required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    customerId: { type: Schema.Types.ObjectId, ref: 'User' },
    
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true },
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true },
    
    queuePosition: { type: Number, required: true, min: 0 },
    tokenNumber: { type: String, required: true },
    status: { type: String, enum: Object.values(QueueEntryStatus), default: QueueEntryStatus.WAITING, index: true },
    priorityLevel: { type: Number, enum: [1, 2, 3, 4, 5, 6], default: QueuePriority.NORMAL },
    
    estimatedStartTime: { type: Date },
    estimatedEndTime: { type: Date },
    estimatedWaitingTimeInMinutes: { type: Number, default: 0 },
    
    actualWaitingTimeInMinutes: { type: Number },
    
    source: { type: String, required: true, enum: ['APP', 'WALK_IN', 'ADMIN'] },
  },
  {
    timestamps: true,
  }
);

export const QueueEntry = mongoose.model<IQueueEntry>('QueueEntry', queueEntrySchema);
