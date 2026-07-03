import mongoose, { Document, Schema } from 'mongoose';

export enum MetricType {
  API_LATENCY = 'API_LATENCY',
  CPU_USAGE = 'CPU_USAGE',
  MEMORY_USAGE = 'MEMORY_USAGE',
  DB_QUERY_TIME = 'DB_QUERY_TIME',
  ERROR_RATE = 'ERROR_RATE'
}

export interface ISystemMetric extends Document {
  type: MetricType;
  value: number;
  
  tags: {
    endpoint?: string;
    method?: string;
    service?: string;
  };
  
  timestamp: Date;
}

const systemMetricSchema = new Schema<ISystemMetric>(
  {
    type: { type: String, enum: Object.values(MetricType), required: true, index: true },
    value: { type: Number, required: true },
    
    tags: {
      endpoint: { type: String },
      method: { type: String },
      service: { type: String }
    },
    
    timestamp: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: false,
    timeseries: {
      timeField: 'timestamp',
      metaField: 'tags',
      granularity: 'seconds'
    }
  }
);

export const SystemMetric = mongoose.model<ISystemMetric>('SystemMetric', systemMetricSchema);
