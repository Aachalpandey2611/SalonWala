import mongoose, { Document, Schema } from 'mongoose';

export enum AuditStatus {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  UNAUTHORIZED = 'UNAUTHORIZED'
}

export interface IAuditLog extends Document {
  tenantId?: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // Optional for anonymous actions (e.g. failed login)
  
  module: string; // e.g. "BOOKING", "PAYROLL"
  action: string; // e.g. "CREATE", "UPDATE"
  
  resourceId?: string; // ID of the entity affected
  resourceModel?: string; // e.g. "Appointment"
  
  status: AuditStatus;
  
  ipAddress?: string;
  userAgent?: string;
  correlationId?: string; // To track a chain of events (e.g. Booking -> Ledger -> Payroll)
  
  details: any; // Raw payload or diff
  
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    tenantId: { type: Schema.Types.ObjectId, ref: 'Tenant', index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
    
    module: { type: String, required: true, index: true },
    action: { type: String, required: true },
    
    resourceId: { type: String, index: true },
    resourceModel: { type: String },
    
    status: { type: String, enum: Object.values(AuditStatus), required: true, index: true },
    
    ipAddress: { type: String },
    userAgent: { type: String },
    correlationId: { type: String, index: true },
    
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Strict immutability
  }
);

// Optimize time-based searches
auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
