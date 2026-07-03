import mongoose, { Document, Schema } from 'mongoose';

export interface ITraceSession extends Document {
  traceId: string;
  
  endpoint: string;
  method: string;
  
  statusCode: number;
  durationMs: number;
  
  error?: string;
  
  createdAt: Date;
}

const traceSessionSchema = new Schema<ITraceSession>(
  {
    traceId: { type: String, required: true, unique: true },
    
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    
    statusCode: { type: Number, required: true },
    durationMs: { type: Number, required: true },
    
    error: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const TraceSession = mongoose.model<ITraceSession>('TraceSession', traceSessionSchema);
