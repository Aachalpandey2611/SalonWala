import { DashboardLayout } from '../models/DashboardLayout';
import { DashboardPreference } from '../models/DashboardPreference';
import { AnalyticsService } from './analytics.service';
import { redisClient } from '../config/redis';
import { UserRole } from '../constants/roles';

export class DashboardService {
  /**
   * Retrieves the fully hydrated dashboard for the given user, based on their role.
   */
  static async getHydratedDashboard(userId: string, role: string, salonId: string, branchId?: string) {
    const cacheKey = `dashboard:hydrate:${userId}`;
    
    if (redisClient) {
      const cached = await redisClient.get(cacheKey);
      if (cached) return JSON.parse(cached);
    }

    // 1. Fetch layout preference
    const preference = await DashboardPreference.findOne({ userId });
    let layout;

    if (preference && preference.activeLayoutId) {
      layout = await DashboardLayout.findById(preference.activeLayoutId);
    }
    
    if (!layout) {
      // Fetch default layout for role
      layout = await DashboardLayout.findOne({ role: role as any, isDefault: true });
    }

    // 2. Hydrate data based on role
    let dataPayload = {};

    switch (role) {
      case UserRole.SALON_OWNER:
      case UserRole.ADMIN:
      case UserRole.SUPER_ADMIN:
        dataPayload = {
          revenue: await AnalyticsService.getRevenueAnalytics(salonId, branchId),
          live: await AnalyticsService.getLiveDashboard(salonId, branchId),
          bookings: await AnalyticsService.getBookingAnalytics(salonId, branchId)
        };
        break;
      case 'Manager':
      case 'Receptionist':
        dataPayload = {
          live: await AnalyticsService.getLiveDashboard(salonId, branchId)
        };
        break;
      case UserRole.BARBER:
        // Mocking Barber-specific data (Attendance/Commission would normally go here)
        dataPayload = {
          live: await AnalyticsService.getLiveDashboard(salonId, branchId)
        };
        break;
    }

    const result = {
      layout: layout ? layout.gridConfig : [],
      theme: preference ? preference.theme : 'SYSTEM',
      data: dataPayload
    };

    if (redisClient) {
      await redisClient.setex(cacheKey, 60, JSON.stringify(result)); // Cache for 60 seconds
    }

    return result;
  }

  /**
   * Updates user preferences
   */
  static async savePreferences(userId: string, theme: string, refreshInterval: number) {
    let pref = await DashboardPreference.findOne({ userId });
    if (!pref) {
      pref = new DashboardPreference({ userId });
    }
    
    if (theme) pref.theme = theme;
    if (refreshInterval) pref.refreshInterval = refreshInterval;
    
    await pref.save();
    return pref;
  }
}
