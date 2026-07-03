import mongoose, { Document, Schema } from 'mongoose';

export enum Environment {
  DEVELOPMENT = 'DEVELOPMENT',
  STAGING = 'STAGING',
  PRODUCTION = 'PRODUCTION'
}

export enum DeploymentStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  ROLLED_BACK = 'ROLLED_BACK'
}

export interface IDeploymentHistory extends Document {
  environment: Environment;
  
  version: string;
  commitHash: string;
  
  status: DeploymentStatus;
  
  deployedBy: string; // GitHub Actions / User
  
  startedAt: Date;
  completedAt?: Date;
  
  logsUrl?: string; // Link to CI/CD logs
}

const deploymentHistorySchema = new Schema<IDeploymentHistory>(
  {
    environment: { type: String, enum: Object.values(Environment), required: true, index: true },
    
    version: { type: String, required: true },
    commitHash: { type: String, required: true },
    
    status: { type: String, enum: Object.values(DeploymentStatus), default: DeploymentStatus.PENDING },
    
    deployedBy: { type: String, required: true },
    
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    
    logsUrl: { type: String }
  },
  {
    timestamps: false,
  }
);

export const DeploymentHistory = mongoose.model<IDeploymentHistory>('DeploymentHistory', deploymentHistorySchema);
