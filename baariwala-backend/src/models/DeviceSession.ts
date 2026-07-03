import mongoose, { Document, Schema } from 'mongoose';

export interface IDeviceSession extends Document {
  userId: mongoose.Types.ObjectId;
  
  sessionToken: string; // The specific JWT token hash or UUID
  
  deviceInfo: string;
  ipAddress: string;
  
  lastActivity: Date;
  expiresAt: Date;
  
  isRevoked: boolean;
  
  createdAt: Date;
}

const deviceSessionSchema = new Schema<IDeviceSession>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    sessionToken: { type: String, required: true, unique: true },
    
    deviceInfo: { type: String, required: true },
    ipAddress: { type: String, required: true },
    
    lastActivity: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true, index: { expires: '1s' } }, // Auto-delete on expiry
    
    isRevoked: { type: Boolean, default: false }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DeviceSession = mongoose.model<IDeviceSession>('DeviceSession', deviceSessionSchema);
