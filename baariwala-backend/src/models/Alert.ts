import mongoose, { Document, Schema } from 'mongoose';

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface IAlert extends Document {
  title: string;
  description: string;
  
  severity: AlertSeverity;
  
  source: string; // e.g. "MongoDB", "CPU_MONITOR"
  
  isResolved: boolean;
  resolvedAt?: Date;
  
  createdAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    
    severity: { type: String, enum: Object.values(AlertSeverity), required: true, index: true },
    
    source: { type: String, required: true },
    
    isResolved: { type: Boolean, default: false, index: true },
    resolvedAt: { type: Date }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
