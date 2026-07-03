import mongoose, { Document, Schema } from 'mongoose';

export enum ReportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface IGeneratedReport extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  reportCode: string;
  format: string; // CSV, PDF
  
  requestedBy: mongoose.Types.ObjectId;
  status: ReportStatus;
  
  parameters: any; // e.g. { startDate, endDate }
  
  fileUrl?: string; // S3 link or local path once completed
  errorMessage?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

const generatedReportSchema = new Schema<IGeneratedReport>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    
    reportCode: { type: String, required: true },
    format: { type: String, required: true },
    
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(ReportStatus), default: ReportStatus.PENDING, index: true },
    
    parameters: { type: Schema.Types.Mixed },
    
    fileUrl: { type: String },
    errorMessage: { type: String }
  },
  {
    timestamps: true,
  }
);

export const GeneratedReport = mongoose.model<IGeneratedReport>('GeneratedReport', generatedReportSchema);
