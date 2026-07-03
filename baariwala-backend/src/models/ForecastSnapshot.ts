import mongoose, { Document, Schema } from 'mongoose';
import { ForecastDomain } from './ForecastModel';

export interface IForecastSnapshot extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  domain: ForecastDomain;
  modelId: mongoose.Types.ObjectId; // Which model generated this?
  
  forecastDate: Date; // The date this prediction is FOR (e.g. Next week's revenue)
  
  predictions: any; // Flexible JSON for the actual prediction payload
  
  confidenceScore: number;
  
  createdAt: Date; // The date this prediction was MADE
}

const forecastSnapshotSchema = new Schema<IForecastSnapshot>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    
    domain: { type: String, enum: Object.values(ForecastDomain), required: true, index: true },
    modelId: { type: Schema.Types.ObjectId, ref: 'ForecastModel', required: true },
    
    forecastDate: { type: Date, required: true, index: true },
    
    predictions: { type: Schema.Types.Mixed, required: true },
    
    confidenceScore: { type: Number, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Snapshots are immutable
  }
);

export const ForecastSnapshot = mongoose.model<IForecastSnapshot>('ForecastSnapshot', forecastSnapshotSchema);
