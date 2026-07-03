import mongoose, { Document, Schema } from 'mongoose';

export interface IKPIWidgetConfiguration extends Document {
  widgetId: mongoose.Types.ObjectId; // References DashboardWidget
  userId: mongoose.Types.ObjectId;
  
  timeRange: string; // e.g. 'TODAY', 'THIS_WEEK', 'THIS_MONTH', 'CUSTOM'
  chartTypeOverride?: string;
  
  filters: any; // e.g. { branchId: 'xxx', serviceCategory: 'HAIRCUT' }
  
  createdAt: Date;
  updatedAt: Date;
}

const kpiWidgetConfigSchema = new Schema<IKPIWidgetConfiguration>(
  {
    widgetId: { type: Schema.Types.ObjectId, ref: 'DashboardWidget', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    timeRange: { type: String, default: 'TODAY' },
    chartTypeOverride: { type: String },
    
    filters: { type: Schema.Types.Mixed }
  },
  {
    timestamps: true,
  }
);

export const KPIWidgetConfiguration = mongoose.model<IKPIWidgetConfiguration>('KPIWidgetConfiguration', kpiWidgetConfigSchema);
