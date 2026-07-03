import { EventBusService } from './eventBus.service';
import { redisClient } from '../config/redis';
import { socketService } from './socket.service';
import { logger } from '../utils/logger';
import { AnalyticsService } from './analytics.service';

export const setupAnalyticsEventListeners = () => {
  
  // Example 1: Invalidate Revenue Cache when a Payment Succeeds
  EventBusService.subscribe('PaymentSuccess', 'AnalyticsEngine', async (payload: any) => {
    try {
      const { salonId, branchId } = payload;
      if (redisClient) {
        // Clear all revenue cache for this salon
        const keys = await redisClient.keys(`analytics:revenue:${salonId}:*`);
        if (keys.length > 0) await redisClient.del(keys);
      }
      logger.info(`[AnalyticsEngine] Invalidated Revenue Cache for Salon ${salonId}`);
    } catch (error) {
      logger.error(`[AnalyticsEngine] Cache invalidation failed`, error);
    }
  });

  // Example 2: Broadcast Live Metric Updates to connected clients when Bookings change
  EventBusService.subscribe('BookingCompleted', 'AnalyticsEngine', async (payload: any) => {
    try {
      const { salonId, branchId } = payload;
      
      // Fetch fresh live metrics instantly
      const liveMetrics = await AnalyticsService.getLiveDashboard(salonId, branchId);
      
      // Broadcast over Socket.IO (assuming room is branchId or salonId)
      socketService.getIO().to(salonId).emit('LIVE_METRIC_UPDATE', liveMetrics);
      
      logger.info(`[AnalyticsEngine] Broadcasted LIVE_METRIC_UPDATE for Salon ${salonId}`);
    } catch (error) {
      logger.error(`[AnalyticsEngine] Live broadcast failed`, error);
    }
  });
  
  // Note: Add further subscriptions for EmployeeCheckedOut, GoodsReceived, etc. following same pattern.
};
