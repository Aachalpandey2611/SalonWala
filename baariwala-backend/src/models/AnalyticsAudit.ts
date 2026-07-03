import mongoose, { Document, Schema } from 'mongoose';

export enum AnalyticsAuditAction {
  DASHBOARD_ACCESSED = 'DASHBOARD_ACCESSED',
  REPORT_GENERATED = 'REPORT_GENERATED',
  KPI_CONFIG_CHANGED = 'KPI_CONFIG_CHANGED',
  SNAPSHOT_GENERATED = 'SNAPSHOT_GENERATED'
}

export interface IAnalyticsAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  action: AnalyticsAuditAction;
  
  performedBy: mongoose.Types.ObjectId;
  targetMetric?: string;
  
  details?: any;
  
  createdAt: Date;
}

const analyticsAuditSchema = new Schema<IAnalyticsAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    action: { type: String, enum: Object.values(AnalyticsAuditAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetMetric: { type: String },
    
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const AnalyticsAudit = mongoose.model<IAnalyticsAudit>('AnalyticsAudit', analyticsAuditSchema);
