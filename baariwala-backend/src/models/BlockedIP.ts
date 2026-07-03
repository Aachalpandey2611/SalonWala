import mongoose, { Document, Schema } from 'mongoose';

export interface IBlockedIP extends Document {
  ipAddress: string;
  reason: string;
  
  blockedAt: Date;
  expiresAt?: Date; // If null, permanent ban
  
  blockedBy?: mongoose.Types.ObjectId; // E.g., Admin ID or "SYSTEM"
}

const blockedIPSchema = new Schema<IBlockedIP>(
  {
    ipAddress: { type: String, required: true, unique: true },
    reason: { type: String, required: true },
    
    blockedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, index: { expires: '1s' } },
    
    blockedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: false,
  }
);

export const BlockedIP = mongoose.model<IBlockedIP>('BlockedIP', blockedIPSchema);
