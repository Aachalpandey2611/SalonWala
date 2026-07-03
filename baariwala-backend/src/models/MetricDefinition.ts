import mongoose, { Document, Schema } from 'mongoose';

export interface IMetricDefinition extends Document {
  metricId: string; // e.g. "TOTAL_REVENUE", "AVG_WAIT_TIME"
  name: string;
  category: string; // 'REVENUE', 'BOOKING', 'QUEUE', 'EMPLOYEE'
  
  description: string;
  isAvailableForRole: string[]; // e.g. ['Admin', 'SalonOwner']
  
  createdAt: Date;
  updatedAt: Date;
}

const metricDefinitionSchema = new Schema<IMetricDefinition>(
  {
    metricId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    
    description: { type: String, required: true },
    isAvailableForRole: [{ type: String }]
  },
  {
    timestamps: true,
  }
);

export const MetricDefinition = mongoose.model<IMetricDefinition>('MetricDefinition', metricDefinitionSchema);
