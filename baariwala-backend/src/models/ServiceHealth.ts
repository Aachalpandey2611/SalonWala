import mongoose, { Document, Schema } from 'mongoose';

export enum ServiceStatus {
  OPERATIONAL = 'OPERATIONAL',
  DEGRADED = 'DEGRADED',
  DOWN = 'DOWN'
}

export interface IServiceHealth extends Document {
  serviceName: string; // e.g. "MongoDB", "Redis", "Stripe API"
  
  status: ServiceStatus;
  uptimePercentage: number;
  
  lastResponseTimeMs: number;
  lastChecked: Date;
  
  errorCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const serviceHealthSchema = new Schema<IServiceHealth>(
  {
    serviceName: { type: String, required: true, unique: true },
    
    status: { type: String, enum: Object.values(ServiceStatus), required: true },
    uptimePercentage: { type: Number, default: 100 },
    
    lastResponseTimeMs: { type: Number, default: 0 },
    lastChecked: { type: Date, default: Date.now },
    
    errorCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

export const ServiceHealth = mongoose.model<IServiceHealth>('ServiceHealth', serviceHealthSchema);
