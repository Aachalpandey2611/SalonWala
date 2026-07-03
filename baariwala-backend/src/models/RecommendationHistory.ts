import mongoose, { Document, Schema } from 'mongoose';

export enum RecommendationType {
  SLOT = 'SLOT',
  BARBER = 'BARBER',
  SERVICE = 'SERVICE',
  QUEUE = 'QUEUE',
  BRANCH = 'BRANCH',
  RESCHEDULE = 'RESCHEDULE',
}

export interface IRecommendationHistory extends Document {
  customerId?: mongoose.Types.ObjectId;
  salonId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  type: RecommendationType;
  
  // The actual JSON output presented to the user
  recommendationPayload: string;
  
  // High-level confidence score
  confidenceScore: number;
  
  // Did the user accept it?
  accepted: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const recommendationHistorySchema = new Schema<IRecommendationHistory>(
  {
    customerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon' },
    branchId: { type: Schema.Types.ObjectId, ref: 'SalonBranch' },
    
    type: { type: String, enum: Object.values(RecommendationType), required: true, index: true },
    
    recommendationPayload: { type: String, required: true },
    
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    
    accepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export const RecommendationHistory = mongoose.model<IRecommendationHistory>('RecommendationHistory', recommendationHistorySchema);
