import mongoose, { Document, Schema } from 'mongoose';

export enum SecuritySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum SecurityEventType {
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  RATE_LIMIT_VIOLATION = 'RATE_LIMIT_VIOLATION',
  SUSPICIOUS_LOGIN = 'SUSPICIOUS_LOGIN',
  PRIVILEGE_ESCALATION = 'PRIVILEGE_ESCALATION',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED'
}

export interface ISecurityEvent extends Document {
  tenantId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  
  eventType: SecurityEventType;
  severity: SecuritySeverity;
  
  description: string;
  ipAddress: string;
  
  resolved: boolean;
  resolvedBy?: mongoose.Types.ObjectId;
  resolvedAt?: Date;
  
  createdAt: Date;
}

const securityEventSchema = new Schema<ISecurityEvent>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    
    eventType: { type: String, enum: Object.values(SecurityEventType), required: true, index: true },
    severity: { type: String, enum: Object.values(SecuritySeverity), required: true, index: true },
    
    description: { type: String, required: true },
    ipAddress: { type: String, required: true },
    
    resolved: { type: Boolean, default: false },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resolvedAt: { type: Date }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const SecurityEvent = mongoose.model<ISecurityEvent>('SecurityEvent', securityEventSchema);
