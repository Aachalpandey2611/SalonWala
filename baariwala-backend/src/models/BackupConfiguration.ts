import mongoose, { Document, Schema } from 'mongoose';

export enum BackupType {
  DATABASE = 'DATABASE',
  REDIS = 'REDIS',
  MEDIA = 'MEDIA',
  CONFIG = 'CONFIG'
}

export interface IBackupConfiguration extends Document {
  type: BackupType;
  
  cronSchedule: string; // e.g. "0 2 * * *" (Every day at 2 AM)
  
  retentionDays: number; // e.g. 30
  
  isEnabled: boolean;
  
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const backupConfigurationSchema = new Schema<IBackupConfiguration>(
  {
    type: { type: String, enum: Object.values(BackupType), required: true, unique: true },
    
    cronSchedule: { type: String, required: true },
    retentionDays: { type: Number, default: 30 },
    
    isEnabled: { type: Boolean, default: true },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const BackupConfiguration = mongoose.model<IBackupConfiguration>('BackupConfiguration', backupConfigurationSchema);
