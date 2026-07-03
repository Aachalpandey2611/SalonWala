import mongoose, { Document, Schema } from 'mongoose';

export enum WidgetType {
  LINE_CHART = 'LINE_CHART',
  BAR_CHART = 'BAR_CHART',
  PIE_CHART = 'PIE_CHART',
  KPI_CARD = 'KPI_CARD',
  DATA_TABLE = 'DATA_TABLE'
}

export interface IDashboardWidget extends Document {
  salonId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId; // Custom to the user
  
  title: string;
  type: WidgetType;
  metricId: string; // Links to MetricDefinition
  
  position: { x: number; y: number; w: number; h: number };
  
  createdAt: Date;
  updatedAt: Date;
}

const dashboardWidgetSchema = new Schema<IDashboardWidget>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    
    title: { type: String, required: true },
    type: { type: String, enum: Object.values(WidgetType), required: true },
    metricId: { type: String, required: true },
    
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
      w: { type: Number, required: true },
      h: { type: Number, required: true }
    }
  },
  {
    timestamps: true,
  }
);

export const DashboardWidget = mongoose.model<IDashboardWidget>('DashboardWidget', dashboardWidgetSchema);
