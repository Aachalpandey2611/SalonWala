import mongoose, { Document, Schema } from 'mongoose';

export enum ThreatType {
  SQL_INJECTION = 'SQL_INJECTION',
  XSS = 'XSS',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  INVALID_TOKEN = 'INVALID_TOKEN'
}

export interface IThreatLog extends Document {
  type: ThreatType;
  
  ipAddress: string;
  userId?: mongoose.Types.ObjectId;
  
  endpoint: string;
  payload?: any;
  
  createdAt: Date;
}

const threatLogSchema = new Schema<IThreatLog>(
  {
    type: { type: String, enum: Object.values(ThreatType), required: true, index: true },
    
    ipAddress: { type: String, required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    
    endpoint: { type: String, required: true },
    payload: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ThreatLog = mongoose.model<IThreatLog>('ThreatLog', threatLogSchema);
