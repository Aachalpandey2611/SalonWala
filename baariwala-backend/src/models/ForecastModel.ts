import mongoose, { Document, Schema } from 'mongoose';

export enum ModelType {
  TIME_SERIES = 'TIME_SERIES',
  CLASSIFICATION = 'CLASSIFICATION',
  REGRESSION = 'REGRESSION',
  CLUSTERING = 'CLUSTERING'
}

export enum ForecastDomain {
  REVENUE = 'REVENUE',
  APPOINTMENT = 'APPOINTMENT',
  INVENTORY = 'INVENTORY',
  WORKFORCE = 'WORKFORCE',
  CUSTOMER_CHURN = 'CUSTOMER_CHURN'
}

export interface IForecastModel extends Document {
  name: string; // e.g. 'RevenuePredictor_v1.2'
  domain: ForecastDomain;
  type: ModelType;
  
  version: string;
  isActive: boolean;
  
  hyperparameters: any;
  trainingMetrics: {
    accuracy?: number;
    rmse?: number;
    mae?: number;
    lastTrainedAt?: Date;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const forecastModelSchema = new Schema<IForecastModel>(
  {
    name: { type: String, required: true },
    domain: { type: String, enum: Object.values(ForecastDomain), required: true, index: true },
    type: { type: String, enum: Object.values(ModelType), required: true },
    
    version: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    
    hyperparameters: { type: Schema.Types.Mixed },
    trainingMetrics: {
      accuracy: { type: Number },
      rmse: { type: Number },
      mae: { type: Number },
      lastTrainedAt: { type: Date }
    }
  },
  {
    timestamps: true,
  }
);

export const ForecastModel = mongoose.model<IForecastModel>('ForecastModel', forecastModelSchema);
