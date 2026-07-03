import mongoose, { Document, Schema } from 'mongoose';

export interface IAnalyticsCache extends Document {
  salonId: mongoose.Types.ObjectId;
  cacheKey: string; // e.g., "DASHBOARD_LIVE_METRICS"
  
  data: any; // JSON payload
  
  expiresAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const analyticsCacheSchema = new Schema<IAnalyticsCache>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    cacheKey: { type: String, required: true },
    
    data: { type: Schema.Types.Mixed, required: true },
    
    expiresAt: { type: Date, required: true, index: { expires: 0 } } // TTL Index
  },
  {
    timestamps: true,
  }
);

analyticsCacheSchema.index({ salonId: 1, cacheKey: 1 }, { unique: true });

export const AnalyticsCache = mongoose.model<IAnalyticsCache>('AnalyticsCache', analyticsCacheSchema);
