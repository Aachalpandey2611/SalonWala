import mongoose, { Document, Schema } from 'mongoose';

export enum DashboardAuditAction {
  LAYOUT_UPDATED = 'LAYOUT_UPDATED',
  PREFERENCE_UPDATED = 'PREFERENCE_UPDATED',
  WIDGET_CONFIGURED = 'WIDGET_CONFIGURED'
}

export interface IDashboardAudit extends Document {
  salonId?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  
  action: DashboardAuditAction;
  details?: any;
  
  createdAt: Date;
}

const dashboardAuditSchema = new Schema<IDashboardAudit>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon' },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    
    action: { type: String, enum: Object.values(DashboardAuditAction), required: true },
    details: { type: Schema.Types.Mixed }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const DashboardAudit = mongoose.model<IDashboardAudit>('DashboardAudit', dashboardAuditSchema);
