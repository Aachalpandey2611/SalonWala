import mongoose, { Document, Schema } from 'mongoose';

export enum SnapshotPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY'
}

export interface IAnalyticsSnapshot extends Document {
  salonId: mongoose.Types.ObjectId;
  branchId?: mongoose.Types.ObjectId; // Null means Salon-wide
  
  period: SnapshotPeriod;
  date: Date; // e.g. "2026-06-01" for a daily snapshot
  
  metrics: {
    revenue: {
      totalRevenue: number;
      serviceRevenue: number;
      productRevenue: number;
      membershipRevenue: number;
    };
    bookings: {
      totalBookings: number;
      completedBookings: number;
      cancelledBookings: number;
      walkIns: number;
    };
    customers: {
      newCustomers: number;
      returningCustomers: number;
    };
    employees: {
      totalCommission: number;
      activeStaff: number;
    };
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const analyticsSnapshotSchema = new Schema<IAnalyticsSnapshot>(
  {
    salonId: { type: Schema.Types.ObjectId, ref: 'Salon', required: true, index: true },
    branchId: { type: Schema.Types.ObjectId, ref: 'Branch', index: true },
    
    period: { type: String, enum: Object.values(SnapshotPeriod), required: true },
    date: { type: Date, required: true },
    
    metrics: {
      revenue: {
        totalRevenue: { type: Number, default: 0 },
        serviceRevenue: { type: Number, default: 0 },
        productRevenue: { type: Number, default: 0 },
        membershipRevenue: { type: Number, default: 0 }
      },
      bookings: {
        totalBookings: { type: Number, default: 0 },
        completedBookings: { type: Number, default: 0 },
        cancelledBookings: { type: Number, default: 0 },
        walkIns: { type: Number, default: 0 }
      },
      customers: {
        newCustomers: { type: Number, default: 0 },
        returningCustomers: { type: Number, default: 0 }
      },
      employees: {
        totalCommission: { type: Number, default: 0 },
        activeStaff: { type: Number, default: 0 }
      }
    }
  },
  {
    timestamps: true,
  }
);

// Compound index for fast querying
analyticsSnapshotSchema.index({ salonId: 1, branchId: 1, period: 1, date: 1 }, { unique: true });

export const AnalyticsSnapshot = mongoose.model<IAnalyticsSnapshot>('AnalyticsSnapshot', analyticsSnapshotSchema);
