import mongoose, { Document, Schema } from 'mongoose';
import { ForecastDomain } from './ForecastModel';

export interface IForecastConfiguration extends Document {
  salonId: mongoose.Types.ObjectId; // Each salon can configure their forecasting thresholds
  domain: ForecastDomain;
  
  confidenceThreshold: number; // e.g. 80 means don't show recommendations below 80% confidence
  generationFrequency: string; // e.g. 'DAILY', 'WEEKLY', 'MONTHLY'
  
  isActive: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const forecastConfigSchema = new Schema<IForecastConfiguration>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    domain: { type: String, enum: Object.values(ForecastDomain), required: true },
    
    confidenceThreshold: { type: Number, default: 75, min: 1, max: 100 },
    generationFrequency: { type: String, default: 'DAILY' },
    
    isActive: { type: Boolean, default: true }
  },
  {
    timestamps: true,
  }
);

// Compound index
forecastConfigSchema.index({ salonId: 1, domain: 1 }, { unique: true });

export const ForecastConfiguration = mongoose.model<IForecastConfiguration>('ForecastConfiguration', forecastConfigSchema);
