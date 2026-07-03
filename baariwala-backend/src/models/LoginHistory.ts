import mongoose, { Document, Schema } from 'mongoose';

export enum LoginStatus {
  SUCCESS = 'SUCCESS',
  FAILED = 'FAILED',
  LOCKED = 'LOCKED'
}

export interface ILoginHistory extends Document {
  userId?: mongoose.Types.ObjectId; // Might be null if failed attempt for unknown user
  emailAttempted?: string; // Captured on failure
  
  tenantId?: mongoose.Types.ObjectId;
  
  status: LoginStatus;
  
  device: string; // e.g. "iPhone 13", "Windows PC"
  browser: string; // e.g. "Chrome 112"
  ipAddress: string;
  location?: string; // Future architecture ready for GeoIP
  
  loginTime: Date;
  logoutTime?: Date;
  sessionDurationSeconds?: number;
}

const loginHistorySchema = new Schema<ILoginHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    emailAttempted: { type: String, index: true },
    
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    
    status: { type: String, enum: Object.values(LoginStatus), required: true },
    
    device: { type: String, required: true },
    browser: { type: String, required: true },
    ipAddress: { type: String, required: true },
    location: { type: String },
    
    loginTime: { type: Date, default: Date.now },
    logoutTime: { type: Date },
    sessionDurationSeconds: { type: Number }
  },
  {
    timestamps: false,
  }
);

loginHistorySchema.index({ loginTime: -1 });

export const LoginHistory = mongoose.model<ILoginHistory>('LoginHistory', loginHistorySchema);
