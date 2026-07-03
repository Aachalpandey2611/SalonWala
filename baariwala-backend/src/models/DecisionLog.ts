import mongoose, { Document, Schema } from 'mongoose';

export interface IDecisionLog extends Document {
  recommendationHistoryId: mongoose.Types.ObjectId;
  
  // The mathematical breakdown (e.g. Barber A scored 90 because queue=0 and rating=5)
  logicTrace: string;
  
  executionTimeMs: number;
  
  createdAt: Date;
}

const decisionLogSchema = new Schema<IDecisionLog>(
  {
    recommendationHistoryId: { type: Schema.Types.ObjectId, ref: 'RecommendationHistory', required: true, index: true },
    
    logicTrace: { type: String, required: true },
    
    executionTimeMs: { type: Number, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DecisionLog = mongoose.model<IDecisionLog>('DecisionLog', decisionLogSchema);
