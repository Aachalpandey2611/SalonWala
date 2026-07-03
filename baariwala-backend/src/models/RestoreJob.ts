import mongoose, { Document, Schema } from 'mongoose';
import { BackupType } from './BackupConfiguration';

export enum RestoreStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface IRestoreJob extends Document {
  backupJobId: mongoose.Types.ObjectId;
  type: BackupType;
  
  requestedBy: mongoose.Types.ObjectId;
  
  status: RestoreStatus;
  
  targetTenantId?: mongoose.Types.ObjectId; // If partial restore
  
  startedAt?: Date;
  completedAt?: Date;
  
  error?: string;
  createdAt: Date;
}

const restoreJobSchema = new Schema<IRestoreJob>(
  {
    backupJobId: { type: Schema.Types.ObjectId, ref: 'BackupJob', required: true, index: true },
    type: { type: String, enum: Object.values(BackupType), required: true },
    
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    status: { type: String, enum: Object.values(RestoreStatus), default: RestoreStatus.PENDING },
    
    targetTenantId: { type: Schema.Types.ObjectId, ref: 'Tenant' },
    
    startedAt: { type: Date },
    completedAt: { type: Date },
    
    error: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const RestoreJob = mongoose.model<IRestoreJob>('RestoreJob', restoreJobSchema);
