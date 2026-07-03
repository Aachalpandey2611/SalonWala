import mongoose, { Document, Schema } from 'mongoose';
import { ForecastDomain } from './ForecastModel';

export interface IPredictionHistory extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  snapshotId: mongoose.Types.ObjectId;
  domain: ForecastDomain;
  
  forecastDate: Date; // The date that was predicted
  
  predictedValue: any; // e.g. 5000 (revenue)
  actualValue: any; // e.g. 5200 (revenue)
  
  accuracyPercentage: number; // e.g. 96.0
  
  evaluatedAt: Date; // When this accuracy was calculated
}

const predictionHistorySchema = new Schema<IPredictionHistory>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    
    snapshotId: { type: Schema.Types.ObjectId, ref: 'ForecastSnapshot', required: true },
    domain: { type: String, enum: Object.values(ForecastDomain), required: true, index: true },
    
    forecastDate: { type: Date, required: true },
    
    predictedValue: { type: Schema.Types.Mixed, required: true },
    actualValue: { type: Schema.Types.Mixed, required: true },
    
    accuracyPercentage: { type: Number, required: true },
    
    evaluatedAt: { type: Date, default: Date.now }
  },
  {
    timestamps: false, // Immutable
  }
);

export const PredictionHistory = mongoose.model<IPredictionHistory>('PredictionHistory', predictionHistorySchema);
