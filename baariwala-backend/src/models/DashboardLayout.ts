import mongoose, { Document, Schema } from 'mongoose';

export enum DashboardRole {
  CUSTOMER = 'CUSTOMER',
  BARBER = 'BARBER',
  RECEPTIONIST = 'RECEPTIONIST',
  BRANCH_MANAGER = 'BRANCH_MANAGER',
  SALON_OWNER = 'SALON_OWNER',
  REGIONAL_MANAGER = 'REGIONAL_MANAGER',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export interface IDashboardLayout extends Document {
  role: DashboardRole;
  isDefault: boolean; // Indicates if this is the system-wide default layout for the role
  
  // Customization fields
  salonId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  
  layoutName: string;
  gridConfig: any; // e.g. React-Grid-Layout array: [{ i: 'widget1', x: 0, y: 0, w: 2, h: 2 }]
  
  createdAt: Date;
  updatedAt: Date;
}

const dashboardLayoutSchema = new Schema<IDashboardLayout>(
  {
    role: { type: String, enum: Object.values(DashboardRole), required: true, index: true },
    isDefault: { type: Boolean, default: false },
    
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon' },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    
    layoutName: { type: String, required: true },
    gridConfig: { type: Schema.Types.Mixed, required: true }
  },
  {
    timestamps: true,
  }
);

// Compound index to quickly find user-specific layouts
dashboardLayoutSchema.index({ role: 1, userId: 1 });

export const DashboardLayout = mongoose.model<IDashboardLayout>('DashboardLayout', dashboardLayoutSchema);
