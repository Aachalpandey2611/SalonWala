import { EventBusService } from './eventBus.service';
import { socketService } from './socket.service';
import { logger } from '../utils/logger';
import { AnalyticsService } from './analytics.service';
import { redisClient } from '../config/redis';

export const setupDashboardEventListeners = () => {
  
  // Refreshes the Live Widgets on Dashboard globally when Bookings change
  EventBusService.subscribe('BookingCompleted', 'DashboardEngine', async (payload: any) => {
    try {
      const { salonId, branchId } = payload;
      
      // Clear Dashboard Cache
      if (redisClient) {
        const keys = await redisClient.keys(`dashboard:hydrate:*`);
        if (keys.length > 0) await redisClient.del(keys);
      }
      
      const liveMetrics = await AnalyticsService.getLiveDashboard(salonId, branchId);
      
      // Broadcast over Socket.IO to any connected UI Dashboards
      socketService.getIO().to(salonId).emit('DASHBOARD_WIDGET_REFRESH', {
        widgetType: 'LIVE_QUEUE',
        data: liveMetrics
      });
      
      logger.info(`[DashboardEngine] Broadcasted WIDGET_REFRESH for Salon ${salonId}`);
    } catch (error) {
      logger.error(`[DashboardEngine] Widget refresh failed`, error);
    }
  });

  // Additional events (PaymentSuccess, InventoryUpdated, AttendanceApproved) would follow the same pattern here.
};
