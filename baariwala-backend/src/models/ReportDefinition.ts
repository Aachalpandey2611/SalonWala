import mongoose, { Document, Schema } from 'mongoose';

export interface IReportDefinition extends Document {
  reportCode: string; // e.g. FINANCIAL_REVENUE_MONTHLY
  name: string;
  category: string; // e.g. FINANCIAL, INVENTORY, EMPLOYEE
  
  description: string;
  supportedFormats: string[]; // e.g. ['CSV', 'PDF']
  
  requiredRoles: string[]; // e.g. ['Admin', 'SalonOwner']
  
  createdAt: Date;
  updatedAt: Date;
}

const reportDefinitionSchema = new Schema<IReportDefinition>(
  {
    reportCode: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    
    description: { type: String, required: true },
    supportedFormats: [{ type: String }],
    
    requiredRoles: [{ type: String }]
  },
  {
    timestamps: true,
  }
);

export const ReportDefinition = mongoose.model<IReportDefinition>('ReportDefinition', reportDefinitionSchema);
