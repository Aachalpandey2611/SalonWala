import mongoose, { Document, Schema } from 'mongoose';

export enum InsightAuditAction {
  RECOMMENDATION_ACCEPTED = 'RECOMMENDATION_ACCEPTED',
  RECOMMENDATION_REJECTED = 'RECOMMENDATION_REJECTED',
  CONFIGURATION_CHANGED = 'CONFIGURATION_CHANGED',
  MODEL_VERSION_CHANGED = 'MODEL_VERSION_CHANGED'
}

export interface IAIInsightAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Who performed the action
  
  action: InsightAuditAction;
  details?: any; // The ID of the recommendation, or the config diff
  
  createdAt: Date;
}

const aiInsightAuditSchema = new Schema<IAIInsightAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    action: { type: String, enum: Object.values(InsightAuditAction), required: true },
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AIInsightAudit = mongoose.model<IAIInsightAudit>('AIInsightAudit', aiInsightAuditSchema);
