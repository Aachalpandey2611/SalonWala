import mongoose, { Document, Schema } from 'mongoose';

export enum ChangeType {
  ADDED = 'ADDED',
  MODIFIED = 'MODIFIED',
  REMOVED = 'REMOVED',
  DEPRECATED = 'DEPRECATED'
}

export interface IApiChangelog extends Document {
  versionId: mongoose.Types.ObjectId;
  
  endpoint: string; // e.g. "/api/v1/bookings"
  method: string;
  
  type: ChangeType;
  description: string;
  
  isBreakingChange: boolean;
  
  createdAt: Date;
}

const apiChangelogSchema = new Schema<IApiChangelog>(
  {
    versionId: { type: Schema.Types.ObjectId, ref: 'ApiVersion', required: true, index: true },
    
    endpoint: { type: String, required: true },
    method: { type: String, required: true },
    
    type: { type: String, enum: Object.values(ChangeType), required: true },
    description: { type: String, required: true },
    
    isBreakingChange: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ApiChangelog = mongoose.model<IApiChangelog>('ApiChangelog', apiChangelogSchema);
