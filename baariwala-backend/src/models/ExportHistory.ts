import mongoose, { Document, Schema } from 'mongoose';

export interface IExportHistory extends Document {
  salonId: mongoose.Types.ObjectId;
  generatedReportId: mongoose.Types.ObjectId;
  
  downloadedBy: mongoose.Types.ObjectId;
  downloadDate: Date;
  
  ipAddress?: string;
  userAgent?: string;
  
  createdAt: Date;
}

const exportHistorySchema = new Schema<IExportHistory>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    generatedReportId: { type: Schema.Types.ObjectId, ref: 'GeneratedReport', required: true },
    
    downloadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    downloadDate: { type: Date, default: Date.now },
    
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

export const ExportHistory = mongoose.model<IExportHistory>('ExportHistory', exportHistorySchema);
