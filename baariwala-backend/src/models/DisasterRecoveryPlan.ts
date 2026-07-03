import mongoose, { Document, Schema } from 'mongoose';

export enum FailureScenario {
  DATABASE_FAILURE = 'DATABASE_FAILURE',
  REDIS_FAILURE = 'REDIS_FAILURE',
  STORAGE_FAILURE = 'STORAGE_FAILURE'
}

export interface IDisasterRecoveryPlan extends Document {
  scenario: FailureScenario;
  
  description: string;
  playbookUrl: string; // Link to documentation
  
  autoFailoverEnabled: boolean;
  
  lastTestedAt?: Date;
  
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const disasterRecoveryPlanSchema = new Schema<IDisasterRecoveryPlan>(
  {
    scenario: { type: String, enum: Object.values(FailureScenario), required: true, unique: true },
    
    description: { type: String, required: true },
    playbookUrl: { type: String, required: true },
    
    autoFailoverEnabled: { type: Boolean, default: false },
    
    lastTestedAt: { type: Date },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const DisasterRecoveryPlan = mongoose.model<IDisasterRecoveryPlan>('DisasterRecoveryPlan', disasterRecoveryPlanSchema);
