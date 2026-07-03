import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendationMetrics extends Document {
  salonId: mongoose.Types.ObjectId;
  
  date: string; // YYYY-MM-DD
  
  totalRecommendationsGenerated: number;
  totalRecommendationsAccepted: number;
  
  acceptanceRatePercentage: number;
  
  createdAt: Date;
  updatedAt: Date;
}

const recommendationMetricsSchema = new Schema<IRecommendationMetrics>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    date: { type: String, required: true },
    
    totalRecommendationsGenerated: { type: Number, default: 0 },
    totalRecommendationsAccepted: { type: Number, default: 0 },
    
    acceptanceRatePercentage: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

recommendationMetricsSchema.index({ salonId: 1, date: 1 }, { unique: true });

export const RecommendationMetrics = mongoose.model<IRecommendationMetrics>('RecommendationMetrics', recommendationMetricsSchema);
