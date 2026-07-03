import mongoose, { Document, Schema } from 'mongoose';
import { BackupType } from './BackupConfiguration';

export enum BackupStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface IBackupJob extends Document {
  type: BackupType;
  
  status: BackupStatus;
  
  fileSizeMb?: number;
  checksum?: string;
  storageUrl?: string; // e.g. s3://bucket/backup-xyz
  
  startedAt: Date;
  completedAt?: Date;
  
  error?: string;
}

const backupJobSchema = new Schema<IBackupJob>(
  {
    type: { type: String, enum: Object.values(BackupType), required: true, index: true },
    
    status: { type: String, enum: Object.values(BackupStatus), required: true, index: true },
    
    fileSizeMb: { type: Number },
    checksum: { type: String },
    storageUrl: { type: String },
    
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    
    error: { type: String }
  },
  {
    timestamps: false,
  }
);

export const BackupJob = mongoose.model<IBackupJob>('BackupJob', backupJobSchema);
