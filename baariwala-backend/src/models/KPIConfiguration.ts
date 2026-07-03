import mongoose, { Document, Schema } from 'mongoose';

export interface IKPIConfiguration extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId;
  
  metricId: string; // e.g. "MONTHLY_REVENUE"
  
  targetValue: number;
  alertThreshold: number; // e.g., alert if below 80% of target
  
  createdBy: mongoose.Types.ObjectId;
  
  createdAt: Date;
  updatedAt: Date;
}

const kpiConfigurationSchema = new Schema<IKPIConfiguration>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch' },
    
    metricId: { type: String, required: true },
    
    targetValue: { type: Number, required: true },
    alertThreshold: { type: Number, required: true, min: 0, max: 100 },
    
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

export const KPIConfiguration = mongoose.model<IKPIConfiguration>('KPIConfiguration', kpiConfigurationSchema);
