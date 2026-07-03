import mongoose, { Document, Schema } from 'mongoose';

export interface IReportTemplate extends Document {
  salonId: mongoose.Types.ObjectId;
  
  name: string;
  reportCode: string;
  
  columns: string[]; // Specific columns selected by the user
  filters: any;
  sorting: any;
  
  createdBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const reportTemplateSchema = new Schema<IReportTemplate>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    
    name: { type: String, required: true },
    reportCode: { type: String, required: true },
    
    columns: [{ type: String }],
    filters: { type: Schema.Types.Mixed },
    sorting: { type: Schema.Types.Mixed },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

export const ReportTemplate = mongoose.model<IReportTemplate>('ReportTemplate', reportTemplateSchema);
