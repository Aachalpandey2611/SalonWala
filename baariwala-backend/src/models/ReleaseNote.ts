import mongoose, { Document, Schema } from 'mongoose';

export interface IReleaseNote extends Document {
  version: string; // SemVer e.g. "1.2.0"
  
  title: string;
  changelog: string;
  
  isHotfix: boolean;
  
  releasedAt: Date;
  releasedBy: string;
}

const releaseNoteSchema = new Schema<IReleaseNote>(
  {
    version: { type: String, required: true, unique: true },
    
    title: { type: String, required: true },
    changelog: { type: String, required: true },
    
    isHotfix: { type: Boolean, default: false },
    
    releasedAt: { type: Date, default: Date.now },
    releasedBy: { type: String, required: true }
  },
  {
    timestamps: false,
  }
);

export const ReleaseNote = mongoose.model<IReleaseNote>('ReleaseNote', releaseNoteSchema);
