import mongoose, { Document, Schema } from 'mongoose';

export interface IQueueMetrics extends Document {
  queueId: mongoose.Types.ObjectId;
  salonId: mongoose.Types.ObjectId;
  branchId: mongoose.Types.ObjectId;
  barberId: mongoose.Types.ObjectId;
  
  date: string; // YYYY-MM-DD
  
  averageWaitTimeInMinutes: number;
  longestWaitTimeInMinutes: number;
  shortestWaitTimeInMinutes: number;
  
  customersServed: number;
  customersSkipped: number;
  walkInCount: number;
  lateArrivalCount: number;
  
  queueUtilizationPercentage: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const queueMetricsSchema = new Schema<IQueueMetrics>(
  {
    queueId: { type: Schema.Types.ObjectId, ref: 'Queue', required: true, unique: true }, // One metrics doc per queue per day
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch', required: true },
    barberId: { type: Schema.Types.ObjectId, ref: 'Barber', required: true },
    
    date: { type: String, required: true },
    
    averageWaitTimeInMinutes: { type: Number, default: 0 },
    longestWaitTimeInMinutes: { type: Number, default: 0 },
    shortestWaitTimeInMinutes: { type: Number, default: 0 },
    
    customersServed: { type: Number, default: 0 },
    customersSkipped: { type: Number, default: 0 },
    walkInCount: { type: Number, default: 0 },
    lateArrivalCount: { type: Number, default: 0 },
    
    queueUtilizationPercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const QueueMetrics = mongoose.model<IQueueMetrics>('QueueMetrics', queueMetricsSchema);
