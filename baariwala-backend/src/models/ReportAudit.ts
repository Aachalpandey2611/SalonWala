import mongoose, { Document, Schema } from 'mongoose';

export enum ReportAuditAction {
  REPORT_REQUESTED = 'REPORT_REQUESTED',
  REPORT_GENERATED = 'REPORT_GENERATED',
  SCHEDULE_CREATED = 'SCHEDULE_CREATED',
  TEMPLATE_CREATED = 'TEMPLATE_CREATED'
}

export interface IReportAudit extends Document {
  salonId: mongoose.Types.ObjectId;
  action: ReportAuditAction;
  
  performedBy: mongoose.Types.ObjectId; // Could be SYSTEM if scheduled
  targetId?: mongoose.Types.ObjectId; // GeneratedReport ID or Schedule ID
  
  details?: any;
  
  createdAt: Date;
}

const reportAuditSchema = new Schema<IReportAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    action: { type: String, enum: Object.values(ReportAuditAction), required: true },
    
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    targetId: { type: Schema.Types.ObjectId },
    
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ReportAudit = mongoose.model<IReportAudit>('ReportAudit', reportAuditSchema);
