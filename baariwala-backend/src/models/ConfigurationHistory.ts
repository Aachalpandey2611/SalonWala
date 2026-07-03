import mongoose, { Document, Schema } from 'mongoose';

export enum ConfigChangeAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  ROLLBACK = 'ROLLBACK'
}

export interface IConfigurationHistory extends Document {
  settingId: mongoose.Types.ObjectId;
  
  action: ConfigChangeAction;
  
  previousValue: any;
  newValue: any;
  
  changedBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
}

const configurationHistorySchema = new Schema<IConfigurationHistory>(
  {
    settingId: { type: Schema.Types.ObjectId, ref: 'PlatformSetting', required: true, index: true },
    
    action: { type: String, enum: Object.values(ConfigChangeAction), required: true },
    
    previousValue: { type: Schema.Types.Mixed },
    newValue: { type: Schema.Types.Mixed },
    
    changedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ConfigurationHistory = mongoose.model<IConfigurationHistory>('ConfigurationHistory', configurationHistorySchema);
