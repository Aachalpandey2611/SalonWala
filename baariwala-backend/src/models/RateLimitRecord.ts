import mongoose, { Document, Schema } from 'mongoose';

export interface IRateLimitRecord extends Document {
  ipAddress: string;
  endpoint: string;
  
  hits: number;
  
  windowStart: Date;
  windowEnd: Date;
}

const rateLimitRecordSchema = new Schema<IRateLimitRecord>(
  {
    ipAddress: { type: String, required: true },
    endpoint: { type: String, required: true },
    
    hits: { type: Number, default: 1 },
    
    windowStart: { type: Date, required: true },
    windowEnd: { type: Date, required: true, index: { expires: '1s' } } // Auto-drop when window expires
  },
  {
    timestamps: false,
  }
);

rateLimitRecordSchema.index({ ipAddress: 1, endpoint: 1, windowStart: 1 }, { unique: true });

export const RateLimitRecord = mongoose.model<IRateLimitRecord>('RateLimitRecord', rateLimitRecordSchema);
