import mongoose, { Document, Schema } from 'mongoose';

export enum SettingLevel {
  GLOBAL = 'GLOBAL',
  TENANT = 'TENANT',
  BRANCH = 'BRANCH'
}

export interface IPlatformSetting extends Document {
  key: string; // e.g. "booking.maxAdvanceDays"
  value: any;
  type: string; // 'string', 'number', 'boolean', 'json'
  
  level: SettingLevel;
  
  tenantId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  description: string;
  isReadOnly: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const platformSettingSchema = new Schema<IPlatformSetting>(
  {
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
    type: { type: String, required: true },
    
    level: { type: String, enum: Object.values(SettingLevel), required: true },
    
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    
    description: { type: String },
    isReadOnly: { type: Boolean, default: false }
  },
  {
    timestamps: true,
  }
);

// Optimize hierarchical resolution
platformSettingSchema.index({ key: 1, level: 1, tenantId: 1, branchId: 1 }, { unique: true });

export const PlatformSetting = mongoose.model<IPlatformSetting>('PlatformSetting', platformSettingSchema);
