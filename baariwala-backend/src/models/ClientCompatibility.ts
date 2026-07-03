import mongoose, { Document, Schema } from 'mongoose';

export enum ClientPlatform {
  ANDROID = 'ANDROID',
  IOS = 'IOS',
  WEB = 'WEB'
}

export interface IClientCompatibility extends Document {
  platform: ClientPlatform;
  
  minSupportedVersion: string; // e.g. "1.2.0" -> versions below this are FORCE UPDATED
  latestVersion: string; // e.g. "1.5.0"
  
  deprecationWarningThreshold: string; // e.g. "1.3.0" -> versions below this get a soft warning
  
  updatedAt: Date;
}

const clientCompatibilitySchema = new Schema<IClientCompatibility>(
  {
    platform: { type: String, enum: Object.values(ClientPlatform), required: true, unique: true },
    
    minSupportedVersion: { type: String, required: true },
    latestVersion: { type: String, required: true },
    
    deprecationWarningThreshold: { type: String, required: true }
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

export const ClientCompatibility = mongoose.model<IClientCompatibility>('ClientCompatibility', clientCompatibilitySchema);
