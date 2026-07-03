import mongoose, { Document, Schema } from 'mongoose';
import { ForecastDomain } from './ForecastModel';

export enum RecommendationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum RecommendationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  IGNORED = 'IGNORED'
}

export interface IAIRecommendation extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  domain: ForecastDomain;
  snapshotId: mongoose.Types.ObjectId; // Link to the forecast that generated this recommendation
  
  title: string; // e.g. "Hire 1 additional barber on weekends"
  reason: string; // e.g. "Peak hour bookings exceeded capacity by 20% for 3 consecutive weekends"
  suggestedAction: string; // Link to UI action or raw text
  
  expectedImpact: string; // e.g. "+15% Revenue"
  confidenceScore: number;
  
  priority: RecommendationPriority;
  status: RecommendationStatus;
  
  actionedBy?: mongoose.Types.ObjectId; // User who accepted/rejected it
  actionedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const aiRecommendationSchema = new Schema<IAIRecommendation>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    
    domain: { type: String, enum: Object.values(ForecastDomain), required: true, index: true },
    snapshotId: { type: Schema.Types.ObjectId, ref: 'ForecastSnapshot', required: true },
    
    title: { type: String, required: true },
    reason: { type: String, required: true },
    suggestedAction: { type: String, required: true },
    
    expectedImpact: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    
    priority: { type: String, enum: Object.values(RecommendationPriority), required: true },
    status: { type: String, enum: Object.values(RecommendationStatus), default: RecommendationStatus.PENDING },
    
    actionedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    actionedAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

export const AIRecommendation = mongoose.model<IAIRecommendation>('AIRecommendation', aiRecommendationSchema);
