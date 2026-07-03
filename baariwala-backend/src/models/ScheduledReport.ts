import mongoose, { Document, Schema } from 'mongoose';

export interface IScheduledReport extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  reportCode: string;
  format: string; // CSV, PDF
  
  cronExpression: string; // e.g. "0 0 * * *" for daily
  
  parameters: any;
  
  createdBy: mongoose.Types.ObjectId;
  isActive: boolean;
  
  lastRunAt?: Date;
  nextRunAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const scheduledReportSchema = new Schema<IScheduledReport>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    
    reportCode: { type: String, required: true },
    format: { type: String, required: true },
    
    cronExpression: { type: String, required: true },
    
    parameters: { type: Schema.Types.Mixed },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    
    lastRunAt: { type: Date },
    nextRunAt: { type: Date }
  },
  {
    timestamps: true,
  }
);

export const ScheduledReport = mongoose.model<IScheduledReport>('ScheduledReport', scheduledReportSchema);
