import mongoose, { Document, Schema } from 'mongoose';

export interface IDashboardPreference extends Document {
  userId: mongoose.Types.ObjectId;
  
  activeLayoutId: mongoose.Types.ObjectId;
  theme: string; // e.g. 'LIGHT', 'DARK', 'SYSTEM'
  
  refreshInterval: number; // in seconds, default 60
  
  createdAt: Date;
  updatedAt: Date;
}

const dashboardPreferenceSchema = new Schema<IDashboardPreference>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    activeLayoutId: { type: Schema.Types.ObjectId, ref: 'DashboardLayout' },
    theme: { type: String, default: 'SYSTEM' },
    
    refreshInterval: { type: Number, default: 60 }
  },
  {
    timestamps: true,
  }
);

export const DashboardPreference = mongoose.model<IDashboardPreference>('DashboardPreference', dashboardPreferenceSchema);
