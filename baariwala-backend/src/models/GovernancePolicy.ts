import mongoose, { Document, Schema } from 'mongoose';

export interface IGovernancePolicy extends Document {
  tenantId?: mongoose.Types.ObjectId; // If null, it's global platform policy
  
  passwordPolicy: {
    minLength: number;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expireDays: number;
  };
  
  sessionPolicy: {
    timeoutMinutes: number;
    maxConcurrentSessions: number;
  };
  
  lockoutPolicy: {
    maxFailedAttempts: number;
    lockoutDurationMinutes: number;
  };
  
  updatedBy: mongoose.Types.ObjectId;
  updatedAt: Date;
}

const governancePolicySchema = new Schema<IGovernancePolicy>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', unique: true, sparse: true },
    
    passwordPolicy: {
      minLength: { type: Number, default: 8 },
      requireNumbers: { type: Boolean, default: true },
      requireSpecialChars: { type: Boolean, default: true },
      expireDays: { type: Number, default: 90 }
    },
    
    sessionPolicy: {
      timeoutMinutes: { type: Number, default: 60 },
      maxConcurrentSessions: { type: Number, default: 3 }
    },
    
    lockoutPolicy: {
      maxFailedAttempts: { type: Number, default: 5 },
      lockoutDurationMinutes: { type: Number, default: 15 }
    },
    
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

export const GovernancePolicy = mongoose.model<IGovernancePolicy>('GovernancePolicy', governancePolicySchema);
