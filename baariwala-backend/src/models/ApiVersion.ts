import mongoose, { Document, Schema } from 'mongoose';

export enum ApiLifecycle {
  DRAFT = 'DRAFT',
  BETA = 'BETA',
  STABLE = 'STABLE',
  DEPRECATED = 'DEPRECATED',
  RETIRED = 'RETIRED'
}

export interface IApiVersion extends Document {
  version: string; // e.g. "v1", "v2"
  
  status: ApiLifecycle;
  
  releaseDate?: Date;
  sunsetDate?: Date; // Only populated if DEPRECATED
  
  migrationGuideUrl?: string; // Link to dev portal documentation
  
  createdAt: Date;
  updatedAt: Date;
}

const apiVersionSchema = new Schema<IApiVersion>(
  {
    version: { type: String, required: true, unique: true },
    
    status: { type: String, enum: Object.values(ApiLifecycle), required: true, index: true },
    
    releaseDate: { type: Date },
    sunsetDate: { type: Date },
    
    migrationGuideUrl: { type: String }
  },
  {
    timestamps: true,
  }
);

export const ApiVersion = mongoose.model<IApiVersion>('ApiVersion', apiVersionSchema);
