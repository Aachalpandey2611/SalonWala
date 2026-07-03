import mongoose, { Document, Schema } from 'mongoose';

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  FATAL = 'FATAL'
}

export interface ILogIndex extends Document {
  level: LogLevel;
  
  message: string;
  module?: string;
  
  correlationId?: string; // Request ID to trace flows
  
  metadata: any; // Stack traces, user ids, etc.
  
  createdAt: Date;
}

const logIndexSchema = new Schema<ILogIndex>(
  {
    level: { type: String, enum: Object.values(LogLevel), required: true, index: true },
    
    message: { type: String, required: true },
    module: { type: String, index: true },
    
    correlationId: { type: String, index: true },
    
    metadata: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable logs
  }
);

export const LogIndex = mongoose.model<ILogIndex>('LogIndex', logIndexSchema);
