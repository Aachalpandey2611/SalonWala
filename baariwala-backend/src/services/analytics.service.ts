import { LedgerJournal, TransactionType } from '../models/LedgerJournal';
import { Appointment as Booking, BookingStatus } from '../models/Appointment';
import { User as Customer } from '../models/User';
import { AnalyticsCache } from '../models/AnalyticsCache';
import { AnalyticsAudit, AnalyticsAuditAction } from '../models/AnalyticsAudit';
import mongoose from 'mongoose';
import { redisClient } from '../config/redis';
import { logger } from '../utils/logger';

export class AnalyticsService {
  /**
   * REVENUE ANALYTICS
   * Aggregates completed revenue from LedgerJournal
   */
  static async getRevenueAnalytics(salonId: string, branchId?: string, startDate?: Date, endDate?: Date) {
    const cacheKey = `analytics:revenue:${salonId}:${branchId || 'ALL'}:${startDate?.toISOString() || 'ALL'}:${endDate?.toISOString() || 'ALL'}`;
    
    // Check Redis Cache
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    const matchStage: any = { salonId: new mongoose.Types.ObjectId(salonId), transactionType: TransactionType.BOOKING_PAYMENT };
    if (branchId) matchStage.branchId = new mongoose.Types.ObjectId(branchId);
    if (startDate || endDate) {
      matchStage.createdAt = {};
      if (startDate) matchStage.createdAt.$gte = startDate;
      if (endDate) matchStage.createdAt.$lte = endDate;
    }

    const pipeline: any[] = [
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          totalRevenue: { $sum: '$totalAmount' },
          transactionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ];

    const result = await LedgerJournal.aggregate(pipeline);
    
    // Set Cache (15 min TTL)
    if (redisClient) {
      await redisClient.setex(cacheKey, 900, JSON.stringify(result));
    }

    return result;
  }

  /**
   * BOOKING ANALYTICS
   */
  static async getBookingAnalytics(salonId: string, branchId?: string) {
    const matchStage: any = { salonId: new mongoose.Types.ObjectId(salonId) };
    if (branchId) matchStage.branchId = new mongoose.Types.ObjectId(branchId);

    const pipeline = [
      { $match: matchStage },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ];

    const result = await Booking.aggregate(pipeline);
    
    let total = 0;
    let completed = 0;
    let cancelled = 0;
    
    result.forEach((b: any) => {
      total += b.count;
      if (b._id === BookingStatus.COMPLETED) completed += b.count;
      if (b._id === BookingStatus.CANCELLED_BY_CUSTOMER || b._id === BookingStatus.CANCELLED_BY_SALON) cancelled += b.count;
    });

    return { total, completed, cancelled, completionRate: total > 0 ? (completed / total) * 100 : 0 };
  }

  /**
   * CUSTOMER ANALYTICS
   */
  static async getCustomerAnalytics(salonId: string) {
    const pipeline = [
      { $match: { salonId: new mongoose.Types.ObjectId(salonId) } },
      {
        $group: {
          _id: null,
          totalCustomers: { $sum: 1 },
          avgLtv: { $avg: '$lifetimeValue' }
        }
      }
    ];

    const result = await Customer.aggregate(pipeline);
    return result[0] || { totalCustomers: 0, avgLtv: 0 };
  }

  /**
   * LIVE DASHBOARD METRICS
   * Bypasses heavy aggregation for quick counts.
   */
  static async getLiveDashboard(salonId: string, branchId?: string) {
    const today = new Date();
    today.setHours(0,0,0,0);

    const matchStage: any = { salonId: new mongoose.Types.ObjectId(salonId), appointmentDate: { $gte: today } };
    if (branchId) matchStage.branchId = new mongoose.Types.ObjectId(branchId);

    const [todayBookings, activeCustomers] = await Promise.all([
      Booking.countDocuments(matchStage),
      Booking.countDocuments({ ...matchStage, status: BookingStatus.CHECKED_IN })
    ]);

    return {
      todayBookings,
      activeCustomersWaiting: activeCustomers
    };
  }

  /**
   * Log Analytics Access
   */
  static async logAccess(salonId: string, userId: string, action: AnalyticsAuditAction, targetMetric?: string) {
    await AnalyticsAudit.create({
      salonId,
      performedBy: userId,
      action,
      targetMetric
    });
  }
}
