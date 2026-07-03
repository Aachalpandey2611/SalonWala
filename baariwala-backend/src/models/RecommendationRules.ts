import mongoose, { Document, Schema } from 'mongoose';

export interface IRecommendationRules extends Document {
  salonId: mongoose.Types.ObjectId;
  
  // Weights for Barber Recommendation
  weightWaitTime: number; // e.g. 0.5
  weightRating: number;   // e.g. 0.3
  weightExperience: number; // e.g. 0.2
  
  // Settings for Slot Recommendation
  maxSearchDaysAhead: number; // e.g. 7 days
  
  // Settings for Upsell
  enableServiceUpsell: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const recommendationRulesSchema = new Schema<IRecommendationRules>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, unique: true },
    
    weightWaitTime: { type: Number, default: 0.5, min: 0, max: 1 },
    weightRating: { type: Number, default: 0.3, min: 0, max: 1 },
    weightExperience: { type: Number, default: 0.2, min: 0, max: 1 },
    
    maxSearchDaysAhead: { type: Number, default: 7, min: 1, max: 30 },
    
    enableServiceUpsell: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const RecommendationRules = mongoose.model<IRecommendationRules>('RecommendationRules', recommendationRulesSchema);
